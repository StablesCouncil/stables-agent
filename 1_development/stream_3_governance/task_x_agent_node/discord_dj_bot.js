const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const envPath = fs.existsSync(path.join(__dirname, ".env.dj"))
  ? path.join(__dirname, ".env.dj")
  : path.join(__dirname, ".env");
require("dotenv").config({ path: envPath });

let ffmpegPath = null;
try {
  const ffmpegStatic = require("ffmpeg-static");
  if (ffmpegStatic) {
    ffmpegPath = ffmpegStatic;
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
  StreamType,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
} = require("@discordjs/voice");
const play = require("play-dl");
const YTDLP =
  process.env.YTDLP_PATH ||
  "C:\\\\Users\\\\Charles\\\\AppData\\\\Local\\\\Microsoft\\\\WinGet\\\\Packages\\\\yt-dlp.yt-dlp_Microsoft.Winget.Source_8wekyb3d8bbwe\\\\yt-dlp.exe";

// Feed YouTube cookies to play-dl if provided (Netscape cookies.txt → Cookie: header)
(async () => {
  const cookieFile = process.env.YOUTUBE_COOKIE_FILE;
  if (cookieFile && fs.existsSync(cookieFile)) {
    try {
      const raw = fs.readFileSync(cookieFile, "utf8");
      const lines = raw.split(/\r?\n/);
      const pairs = [];

      for (const line of lines) {
        if (!line || line.startsWith("#")) continue;
        const parts = line.split("\t");
        if (parts.length < 7) continue;
        const [domain, , path, , , name, value] = parts;
        if (!name || !value) continue;

        // Restrict to youtube.com domains
        const cleanDomain = (domain || "").replace(/^\./, "");
        if (!/youtube\.com$/i.test(cleanDomain)) continue;

        pairs.push(`${name}=${value}`);
      }

      if (pairs.length) {
        const header = pairs.join("; ");
        await play.setToken({ youtube: { cookie: header } });
        console.log(
          `[DJ] Loaded YouTube cookies from ${cookieFile} (${pairs.length} youtube.com cookies)`,
        );
      } else {
        console.warn(`[DJ] No youtube.com cookies found in ${cookieFile}`);
      }
    } catch (e) {
      console.warn(`[DJ] Cookie load warning: ${e.message}`);
    }
  }
})();

const REQUIRED_ENV = [
  "DISCORD_DJ_TOKEN",
  "DISCORD_GUILD_ID",
  "DISCORD_VOICE_CHANNEL_ID",
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
  playlistUrl: process.env.YOUTUBE_PLAYLIST_URL || "",
  radioUrl: process.env.RADIO_STREAM_URL || "",
  announceNowPlaying:
    (process.env.DISCORD_ANNOUNCE_NOW_PLAYING || "false").toLowerCase() === "true",
  shuffleOnLoad:
    (process.env.DJ_SHUFFLE_PLAYLIST || "false").toLowerCase() === "true",
};

if (!config.playlistUrl && !config.radioUrl) {
  console.error(
    "[CONFIG] Set either YOUTUBE_PLAYLIST_URL or RADIO_STREAM_URL in .env.dj",
  );
  process.exit(1);
}

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

function createRadioResource(url) {
  const bin = ffmpegPath || "ffmpeg";
  log(`Starting radio stream via ${bin}: ${url}`);
  const ffmpeg = spawn(bin, [
    "-re",
    "-i",
    url,
    "-analyzeduration",
    "0",
    "-loglevel",
    "0",
    "-f",
    "s16le",
    "-ar",
    "48000",
    "-ac",
    "2",
    "pipe:1",
  ]);

  ffmpeg.on("error", (err) => {
    log(`ffmpeg error: ${err.message}`);
  });

  ffmpeg.stdout.on("end", () => {
    log("ffmpeg stream ended.");
  });

  return createAudioResource(ffmpeg.stdout, {
    inputType: StreamType.Raw,
  });
}

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP, args);
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    proc.on("error", (err) => reject(err));
    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(
          new Error(
            `yt-dlp exited with code ${code}: ${stderr.slice(0, 400)}`,
          ),
        );
      }
    });
  });
}

async function createYoutubeResource(playUrl) {
  const bin = ffmpegPath || "ffmpeg";
  const out = await runYtDlp(["-g", "-f", "ba", playUrl]);
  const lines = out.split(/\r?\n/);
  const direct = (lines[0] || "").trim();
  if (!direct) {
    throw new Error("yt-dlp did not return a stream URL");
  }
  log(`yt-dlp resolved stream for ${playUrl}`);

  const ffmpeg = spawn(bin, [
    "-re",
    "-i",
    direct,
    "-analyzeduration",
    "0",
    "-loglevel",
    "0",
    "-f",
    "s16le",
    "-ar",
    "48000",
    "-ac",
    "2",
    "pipe:1",
  ]);

  ffmpeg.on("error", (err) => {
    log(`ffmpeg error (yt): ${err.message}`);
  });

  ffmpeg.stdout.on("end", () => {
    log("ffmpeg yt stream ended.");
  });

  return createAudioResource(ffmpeg.stdout, {
    inputType: StreamType.Raw,
  });
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
  const rawUrl = (track.url || "").trim();
  const id = (track.id || track.videoId || "").trim();
  const playUrl = id ? `https://www.youtube.com/watch?v=${id}` : rawUrl;

  log(`Now playing: ${track.title} (${playUrl})`);
  if (config.announceNowPlaying) {
    await announce(`Now playing: ${track.title}\n${playUrl}`);
  }

  const validated = await play.validate(playUrl);
  log(`validate(${playUrl}) -> ${validated}`);
  if (typeof validated !== "string" || !validated.startsWith("yt_")) {
    throw new Error(`play-dl validate rejected URL: ${playUrl} (${validated})`);
  }

  const resource = await createYoutubeResource(playUrl);

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
  if (!config.radioUrl) {
    const validated = await play.validate(config.playlistUrl);
    if (typeof validated !== "string" || !validated.startsWith("yt_")) {
      throw new Error(
        "YOUTUBE_PLAYLIST_URL is not a valid YouTube playlist or video URL.",
      );
    }
  }

  state.player = createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Play },
  });

  state.player.on(AudioPlayerStatus.Idle, () => {
    if (!state.playbackStarted) return;
    if (config.radioUrl) {
      try {
        const resource = createRadioResource(config.radioUrl);
        state.player.play(resource);
      } catch (err) {
        log(`Radio idle restart error: ${err.message}`);
      }
      return;
    }
    safePlayNextWithRetry().catch((err) => {
      log(`Idle transition error: ${err.message}`);
    });
  });

  state.player.on("error", (err) => {
    log(`Audio player error: ${err.message}`);
    if (config.radioUrl) {
      setTimeout(() => {
        try {
          const resource = createRadioResource(config.radioUrl);
          state.player.play(resource);
        } catch (innerErr) {
          log(`Radio recovery error: ${innerErr.message}`);
        }
      }, 1500);
    } else {
      setTimeout(() => {
        safePlayNextWithRetry().catch((innerErr) => {
          log(`Recovery error: ${innerErr.message}`);
        });
      }, 1500);
    }
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

    if (config.radioUrl) {
      state.playbackStarted = true;
      const resource = createRadioResource(config.radioUrl);
      await connectAndStart(guild, channel);
      state.player.play(resource);
    } else {
      await loadPlaylistVideos();
      await connectAndStart(guild, channel);
    }
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
