const fs = require("fs");
const path = require("path");
const envPath = fs.existsSync(path.join(__dirname, ".env.dj"))
  ? path.join(__dirname, ".env.dj")
  : path.join(__dirname, ".env");
require("dotenv").config({ path: envPath });
try {
  const ffmpegStatic = require("ffmpeg-static");
  if (ffmpegStatic) {
    const ffmpegDir = path.dirname(ffmpegStatic);
    process.env.PATH = `${ffmpegDir}${path.delimiter}${process.env.PATH || ""}`;
  }
} catch {
  // ffmpeg-static optional if host ffmpeg is on PATH
}

const {
  Client,
  GatewayIntentBits,
  ChannelType,
} = require("discord.js");
const {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
} = require("@discordjs/voice");
const play = require("play-dl");

const REQUIRED_ENV = [
  "DISCORD_DJ_TOKEN",
  "DISCORD_GUILD_ID",
  "DISCORD_VOICE_CHANNEL_ID",
  "YOUTUBE_PLAYLIST_URL",
];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[CONFIG] Missing required env var: ${key}`);
    console.error(
      `[CONFIG] Copy .env.dj.example to .env.dj in this folder, fill values, then run again.`,
    );
    process.exit(1);
  }
}

const config = {
  token: process.env.DISCORD_DJ_TOKEN,
  guildId: process.env.DISCORD_GUILD_ID,
  voiceChannelId: process.env.DISCORD_VOICE_CHANNEL_ID,
  textChannelId: process.env.DISCORD_TEXT_CHANNEL_ID || "",
  playlistUrl: process.env.YOUTUBE_PLAYLIST_URL,
  announceNowPlaying: (process.env.DISCORD_ANNOUNCE_NOW_PLAYING || "false").toLowerCase() === "true",
  shuffleOnLoad: (process.env.DJ_SHUFFLE_PLAYLIST || "false").toLowerCase() === "true",
};

const state = {
  playlistVideos: [],
  currentIndex: 0,
  player: null,
  connection: null,
  client: null,
  textChannel: null,
  playbackStarted: false,
};

function log(msg) {
  console.log(`[DJ] ${msg}`);
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

async function loadPlaylistVideos() {
  const playlist = await play.playlist_info(config.playlistUrl, {
    incomplete: true,
  });
  const videos = await playlist.all_videos();
  const playable = videos.filter((v) => v && v.url && !v.private);
  if (!playable.length) {
    throw new Error("Playlist has zero playable videos.");
  }
  if (config.shuffleOnLoad) {
    shuffleInPlace(playable);
  }
  state.playlistVideos = playable;
  state.currentIndex = 0;
  log(`Loaded playlist "${playlist.title}" with ${playable.length} tracks.`);
}

function getNextTrack() {
  const track = state.playlistVideos[state.currentIndex];
  state.currentIndex += 1;
  if (state.currentIndex >= state.playlistVideos.length) {
    state.currentIndex = 0;
  }
  return track;
}

async function announce(text) {
  if (!state.textChannel) return;
  try {
    await state.textChannel.send(text);
  } catch (err) {
    log(`Announcement failed: ${err.message}`);
  }
}

async function playNextTrack() {
  if (!state.connection) {
    throw new Error("Voice connection is not established.");
  }
  if (!state.playlistVideos.length) {
    await loadPlaylistVideos();
  }

  const track = getNextTrack();
  log(`Now playing: ${track.title} (${track.url})`);
  if (config.announceNowPlaying) {
    await announce(`Now playing: ${track.title}\n${track.url}`);
  }

  const stream = await play.stream(track.url, {
    discordPlayerCompatibility: true,
    quality: 2,
  });

  const resource = createAudioResource(stream.stream, {
    inputType: stream.type,
  });

  state.playbackStarted = true;
  state.player.play(resource);
}

async function safePlayNextWithRetry() {
  try {
    await playNextTrack();
  } catch (err) {
    log(`Track failed, skipping. Reason: ${err.message}`);
    setTimeout(() => {
      safePlayNextWithRetry().catch((innerErr) => {
        log(`Unexpected playback error: ${innerErr.message}`);
      });
    }, 1500);
  }
}

async function connectAndStart(guild, voiceChannel) {
  if (state.connection) {
    try {
      state.connection.removeAllListeners();
      state.connection.destroy();
    } catch {
      // no-op
    }
    state.connection = null;
  }

  state.connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: true,
    selfMute: false,
  });

  const onDisconnected = async () => {
    try {
      await Promise.race([
        entersState(state.connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(state.connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
      log("Voice disconnected briefly, recovered.");
    } catch {
      log("Voice disconnected, reconnecting...");
      try {
        state.connection?.removeAllListeners();
        state.connection?.destroy();
      } catch {
        // no-op
      }
      state.connection = null;
      await connectAndStart(guild, voiceChannel);
    }
  };

  state.connection.on(VoiceConnectionStatus.Disconnected, onDisconnected);

  await entersState(state.connection, VoiceConnectionStatus.Ready, 20_000);
  state.connection.subscribe(state.player);
  log(`Joined voice channel: ${voiceChannel.name}`);
  await safePlayNextWithRetry();
}

async function init() {
  const validated = await play.validate(config.playlistUrl);
  if (typeof validated !== "string" || !validated.startsWith("yt_")) {
    throw new Error("YOUTUBE_PLAYLIST_URL is not a valid YouTube playlist or video URL.");
  }

  state.player = createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Play },
  });

  state.player.on(AudioPlayerStatus.Idle, () => {
    if (!state.playbackStarted) return;
    safePlayNextWithRetry().catch((err) => {
      log(`Idle transition error: ${err.message}`);
    });
  });

  state.player.on("error", (err) => {
    log(`Audio player error: ${err.message}`);
    setTimeout(() => {
      safePlayNextWithRetry().catch((innerErr) => {
        log(`Recovery error: ${innerErr.message}`);
      });
    }, 1500);
  });

  const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ];
  if (config.textChannelId && config.announceNowPlaying) {
    intents.push(GatewayIntentBits.GuildMessages);
  }

  state.client = new Client({ intents });

  state.client.once("ready", async () => {
    log(`Env file: ${envPath}`);
    log(`Logged in as ${state.client.user.tag}`);
    const guild = await state.client.guilds.fetch(config.guildId);
    const channel = await guild.channels.fetch(config.voiceChannelId);

    const isVoiceLike =
      channel &&
      (channel.type === ChannelType.GuildVoice ||
        channel.type === ChannelType.GuildStageVoice);
    if (!isVoiceLike) {
      throw new Error(
        "DISCORD_VOICE_CHANNEL_ID must be a guild voice or stage channel.",
      );
    }

    if (config.textChannelId) {
      const text = await guild.channels.fetch(config.textChannelId);
      if (text && text.type === ChannelType.GuildText) {
        state.textChannel = text;
      } else {
        log("DISCORD_TEXT_CHANNEL_ID is set but not a text channel, ignoring.");
      }
    }

    await loadPlaylistVideos();
    await connectAndStart(guild, channel);
  });

  state.client.on("error", (err) => {
    log(`Discord client error: ${err.message}`);
  });

  await state.client.login(config.token);
}

init().catch((err) => {
  console.error(`[DJ] Fatal error: ${err.stack || err.message}`);
  process.exit(1);
});
