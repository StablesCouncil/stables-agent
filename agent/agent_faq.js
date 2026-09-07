/**
 * StablesAgent prepared answers and core facts (2026-09-06).
 *
 * Founder, after the website chat answered "Is my money safe?" with "I don't have enough
 * information in the provided context": "we should have already basic general topics people can
 * choose from, like in the app ... at least these should be preloaded, but generally speaking we
 * have to avoid this situation."
 *
 * Two things live here, shared by the web agent and the Telegram agent:
 *
 *   1. FAQ: the questions the website offers as topics (and their common paraphrases) answered from
 *      prepared text, in the six languages the chat page speaks. A hit is answered at once, with no
 *      model call and no retrieval, so the offered questions can never miss. The text is written
 *      from the knowledge base and says nothing the brain does not say.
 *
 *   2. CORE FACTS: a short card of what is always true about Stables and this test, put in front of
 *      the model on every question. Retrieval is probabilistic; the card is not. It is the floor
 *      under every answer, so a general question can be answered from it even when the three or
 *      five retrieved chunks are about something else.
 *
 * Keep the facts in step with release_scope_boundary.md and minidapp_test_channel_overview.md.
 */

const STABLES_CORE_FACTS = [
  "CORE FACTS ABOUT STABLES (always true, use them freely):",
  "Stables is a merchant-owned banking system built on the Minima blockchain, run by the Stables Council (stablescouncil.org).",
  "It is in an early testing phase on Minima mainnet. The test uses two real tokens that have no value: Winiwa, a practice stand-in for Minima, and xWiniwa, the equity-side test token.",
  "In the test a person can claim 1,000 Winiwa per hour from an on-chain faucet covenant, mint xWiniwa one for one through the on-chain vault, burn xWiniwa back to Winiwa, and send or receive both. Every step is a real on-chain transaction; no keeper, oracle or company signs for the person.",
  "Is my money safe: in this test there is no money at stake, because Winiwa and xWiniwa have no value and nothing in the test is an investment; the person's keys never leave the device, the Council never holds them, and nothing moves without the person's approval on the device. The software is an early build and can have bugs, so real value should never be sent to test-token addresses.",
  "Stablecoins such as USDw, trading, the Exchange, order books, Coverage Funds, merchant tools and the Ambassador program are designed but not part of this test.",
  "The published apps are the standalone Stables Android app, which runs its own Minima node on the phone, and the Minima Core companion, which uses the node and wallet of the official Minima Core Android app. Both are downloaded from stablescouncil.org/payment-app with their SHA-256 checksums. A new version is installed over the old one; the app is never uninstalled, because the wallet lives on the device. The MiniDapp for MinimaOS and the web version come later.",
  "The wallet, the node and the keys live inside the app on the person's device. Stables never asks for a seed phrase or a vault key; anyone who does is attacking the person. This is an early build with bugs expected: testers use a dedicated test wallet or one holding only funds they are willing to risk, and never send real value to test-token addresses."
].join("\n");

/* One entry per topic. `answers` per language; `variants` per language are the offered label plus
   the ways people commonly ask the same thing. Matching is exact on the normalised question, or a
   short question that contains a variant whole. */
const FAQ = [
  {
    id: "what-is-stables",
    variants: {
      en: ["what is stables", "whats stables", "what is stables about", "explain stables", "tell me about stables", "what does stables do"],
      fr: ["qu est ce que stables", "c est quoi stables", "stables c est quoi", "expliquez stables", "parlez moi de stables"],
      de: ["was ist stables", "was macht stables", "erklare stables", "erzahl mir von stables"],
      es: ["que es stables", "que hace stables", "explica stables", "hablame de stables"],
      it: ["che cos e stables", "cos e stables", "cosa fa stables", "spiegami stables", "parlami di stables"],
      zh: ["stables 是什么", "stables是什么", "什么是 stables", "什么是stables", "介绍一下 stables"]
    },
    answers: {
      en: "Stables is a merchant-owned banking system built on the Minima blockchain and run by the Stables Council. The idea is that independent businesses and their customers hold and move money in a system they own, with stablecoins designed for everyday payments and a community treasury behind them. Today it is in an early testing phase on Minima mainnet with valueless test tokens: the stablecoins, the trading surfaces and the merchant tools are designed but not part of this test. The full picture is at stablescouncil.org, and you can ask me about any part of it.",
      fr: "Stables est un système bancaire détenu par les commerçants, construit sur la blockchain Minima et animé par le Stables Council. L'idée : des commerces indépendants et leurs clients détiennent et déplacent leur argent dans un système qui leur appartient, avec des stablecoins conçus pour les paiements du quotidien et une trésorerie communautaire derrière eux. Aujourd'hui, Stables est en phase de test sur le réseau principal de Minima avec des jetons de test sans valeur : les stablecoins, les surfaces de trading et les outils marchands sont conçus mais ne font pas partie de ce test. Le tableau complet est sur stablescouncil.org, et vous pouvez m'interroger sur chaque partie.",
      de: "Stables ist ein händlereigenes Banksystem, das auf der Minima-Blockchain aufgebaut ist und vom Stables Council betrieben wird. Die Idee: unabhängige Geschäfte und ihre Kunden halten und bewegen Geld in einem System, das ihnen gehört, mit Stablecoins für alltägliche Zahlungen und einer Gemeinschaftskasse dahinter. Heute befindet sich Stables in einer frühen Testphase im Minima-Hauptnetz mit wertlosen Test-Token: die Stablecoins, der Handel und die Händlerwerkzeuge sind entworfen, aber nicht Teil dieses Tests. Das ganze Bild finden Sie auf stablescouncil.org, und Sie können mich zu jedem Teil davon fragen.",
      es: "Stables es un sistema bancario propiedad de los comerciantes, construido sobre la blockchain Minima y dirigido por el Stables Council. La idea: los negocios independientes y sus clientes guardan y mueven dinero en un sistema que les pertenece, con stablecoins pensadas para los pagos de cada día y una tesorería comunitaria detrás. Hoy está en una fase temprana de pruebas en la red principal de Minima con tokens de prueba sin valor: las stablecoins, el trading y las herramientas para comercios están diseñados pero no forman parte de esta prueba. El cuadro completo está en stablescouncil.org, y puedes preguntarme por cualquier parte.",
      it: "Stables è un sistema bancario di proprietà dei commercianti, costruito sulla blockchain Minima e guidato dallo Stables Council. L'idea: attività indipendenti e i loro clienti custodiscono e muovono denaro in un sistema che appartiene a loro, con stablecoin pensate per i pagamenti quotidiani e una tesoreria comunitaria alle spalle. Oggi Stables è in una fase iniziale di test sulla rete principale di Minima con token di prova senza valore: le stablecoin, il trading e gli strumenti per i commercianti sono progettati ma non fanno parte di questo test. Il quadro completo è su stablescouncil.org, e puoi chiedermi di ogni parte.",
      zh: "Stables 是一个由商户共同拥有的银行系统，建立在 Minima 区块链上，由 Stables Council 运营。它的理念是：独立商家和他们的顾客在一个属于自己的系统里持有和转移资金，配有面向日常支付的稳定币和背后的社区金库。目前 Stables 处于 Minima 主网上的早期测试阶段，使用没有价值的测试代币：稳定币、交易功能和商户工具已经设计完成，但不在本次测试范围内。完整介绍见 stablescouncil.org，你也可以就任何部分向我提问。"
    }
  },
  {
    id: "what-can-i-test",
    variants: {
      en: ["what can i test today", "what can i test", "what works right now", "what works today", "what can i do today", "what can i do", "what is in the test"],
      fr: ["que puis je tester aujourd hui", "que puis je tester", "qu est ce qui marche", "que peut on faire aujourd hui", "que puis je faire"],
      de: ["was kann ich heute testen", "was kann ich testen", "was funktioniert schon", "was kann ich tun"],
      es: ["que puedo probar hoy", "que puedo probar", "que funciona ya", "que puedo hacer hoy"],
      it: ["cosa posso testare oggi", "cosa posso testare", "cosa funziona gia", "cosa posso fare oggi"],
      zh: ["我今天可以测试什么", "我可以测试什么", "现在能用的功能", "现在可以做什么"]
    },
    answers: {
      en: "The first community test is narrow on purpose. In the Stables Android app you can claim Winiwa from the on-chain faucet, mint it into xWiniwa one for one, burn xWiniwa back to Winiwa, and send or receive both. Every step is a real transaction on Minima mainnet, signed by your own wallet, with no company in the middle. Stablecoins, trading, the Exchange, Coverage Funds and merchant tools are not in this test yet. If you find a bug, the in-app feedback page is the place to report it.",
      fr: "Le premier test communautaire est volontairement restreint. Dans l'application Stables pour Android, vous pouvez réclamer du Winiwa au robinet on-chain, le frapper en xWiniwa au taux de un pour un, brûler du xWiniwa pour retrouver du Winiwa, et envoyer ou recevoir les deux. Chaque étape est une vraie transaction sur le réseau principal de Minima, signée par votre propre portefeuille, sans intermédiaire. Les stablecoins, le trading, l'Exchange, les Coverage Funds et les outils marchands ne font pas encore partie de ce test. Si vous trouvez un bug, la page de retour dans l'application est là pour ça.",
      de: "Der erste Community-Test ist bewusst eng. In der Stables-App für Android können Sie Winiwa aus dem On-Chain-Wasserhahn beanspruchen, es eins zu eins in xWiniwa prägen, xWiniwa wieder in Winiwa verbrennen und beides senden oder empfangen. Jeder Schritt ist eine echte Transaktion im Minima-Hauptnetz, von Ihrem eigenen Wallet signiert, ohne Unternehmen dazwischen. Stablecoins, Handel, die Exchange, Coverage Funds und Händlerwerkzeuge sind noch nicht Teil dieses Tests. Wenn Sie einen Fehler finden, ist die Feedback-Seite in der App der richtige Ort.",
      es: "La primera prueba comunitaria es deliberadamente acotada. En la aplicación Stables para Android puedes reclamar Winiwa del grifo on-chain, acuñarlo en xWiniwa uno a uno, quemar xWiniwa para recuperar Winiwa, y enviar o recibir ambos. Cada paso es una transacción real en la red principal de Minima, firmada por tu propia billetera, sin ninguna empresa en medio. Las stablecoins, el trading, el Exchange, los Coverage Funds y las herramientas para comercios todavía no forman parte de esta prueba. Si encuentras un error, la página de comentarios de la aplicación es el lugar para informarlo.",
      it: "Il primo test della community è volutamente ristretto. Nell'app Stables per Android puoi richiedere Winiwa dal rubinetto on-chain, coniarlo in xWiniwa uno a uno, bruciare xWiniwa per tornare a Winiwa, e inviare o ricevere entrambi. Ogni passaggio è una vera transazione sulla rete principale di Minima, firmata dal tuo portafoglio, senza alcuna società in mezzo. Stablecoin, trading, Exchange, Coverage Fund e strumenti per i commercianti non fanno ancora parte di questo test. Se trovi un bug, la pagina di feedback nell'app è il posto giusto per segnalarlo.",
      zh: "第一次社区测试范围有意收窄。在 Stables 安卓应用中，你可以从链上水龙头领取 Winiwa，按一比一铸造成 xWiniwa，把 xWiniwa 销毁换回 Winiwa，并发送或接收两者。每一步都是 Minima 主网上的真实交易，由你自己的钱包签名，没有任何公司居中。稳定币、交易、Exchange、Coverage Fund 和商户工具还不在本次测试中。如果发现问题，请通过应用内的反馈页面报告。"
    }
  },
  {
    id: "how-do-i-get-winiwa",
    variants: {
      en: ["how do i get winiwa", "how to get winiwa", "get winiwa", "how do i claim winiwa", "claim winiwa", "how does the faucet work", "faucet", "the faucet"],
      fr: ["comment obtenir des winiwa", "comment obtenir du winiwa", "obtenir des winiwa", "comment reclamer du winiwa", "le robinet", "comment marche le robinet"],
      de: ["wie bekomme ich winiwa", "winiwa bekommen", "wie beanspruche ich winiwa", "wie funktioniert der wasserhahn"],
      es: ["como consigo winiwa", "conseguir winiwa", "como reclamo winiwa", "como funciona el grifo"],
      it: ["come ottengo winiwa", "ottenere winiwa", "come richiedo winiwa", "come funziona il rubinetto"],
      zh: ["如何获得 winiwa", "如何获得winiwa", "怎么领取 winiwa", "水龙头怎么用"]
    },
    answers: {
      en: "From the faucet inside the app. Open the Faucet page and claim: each claim gives you 1,000 Winiwa, once per wallet per hour, and it lands as a real transaction on Minima mainnet. The faucet is an on-chain covenant, so nobody approves your claim and nobody can refuse it; your node only needs to be synced first, which the Wallet page shows. Winiwa is a test token with no value, made so you can try minting, burning, sending and receiving.",
      fr: "Au robinet, dans l'application. Ouvrez la page Robinet et réclamez : chaque demande vous donne 1 000 Winiwa, une fois par portefeuille et par heure, sous la forme d'une vraie transaction sur le réseau principal de Minima. Le robinet est un covenant on-chain : personne n'approuve votre demande et personne ne peut la refuser ; votre noeud doit seulement être synchronisé, ce que la page Portefeuille indique. Le Winiwa est un jeton de test sans valeur, fait pour essayer la frappe, la destruction, l'envoi et la réception.",
      de: "Über den Wasserhahn in der App. Öffnen Sie die Seite Wasserhahn und beanspruchen Sie: jede Anforderung gibt Ihnen 1.000 Winiwa, einmal pro Wallet und Stunde, als echte Transaktion im Minima-Hauptnetz. Der Wasserhahn ist ein On-Chain-Covenant: niemand genehmigt Ihre Anforderung und niemand kann sie ablehnen; Ihr Node muss nur synchronisiert sein, was die Wallet-Seite anzeigt. Winiwa ist ein wertloser Test-Token, damit Sie Prägen, Verbrennen, Senden und Empfangen ausprobieren können.",
      es: "Desde el grifo dentro de la aplicación. Abre la página Grifo y reclama: cada reclamo te da 1.000 Winiwa, una vez por billetera y por hora, como una transacción real en la red principal de Minima. El grifo es un covenant on-chain, así que nadie aprueba tu reclamo y nadie puede rechazarlo; tu nodo solo necesita estar sincronizado, lo que muestra la página Billetera. Winiwa es un token de prueba sin valor, hecho para que pruebes acuñar, quemar, enviar y recibir.",
      it: "Dal rubinetto nell'app. Apri la pagina Rubinetto e richiedi: ogni richiesta ti dà 1.000 Winiwa, una volta per portafoglio ogni ora, come vera transazione sulla rete principale di Minima. Il rubinetto è un covenant on-chain, quindi nessuno approva la tua richiesta e nessuno può rifiutarla; il tuo nodo deve solo essere sincronizzato, e la pagina Portafoglio lo mostra. Winiwa è un token di prova senza valore, fatto per provare coniare, bruciare, inviare e ricevere.",
      zh: "在应用内的水龙头页面领取。打开“水龙头”并点击领取：每次领取 1,000 Winiwa，每个钱包每小时一次，会作为一笔真实交易记录在 Minima 主网上。水龙头是一个链上契约，没有人审批你的领取，也没有人能拒绝；只需要你的节点先完成同步，钱包页面会显示状态。Winiwa 是没有价值的测试代币，用来体验铸造、销毁、发送和接收。"
    }
  },
  {
    id: "winiwa-and-xwiniwa",
    variants: {
      en: ["what are winiwa and xwiniwa", "what is winiwa", "what is xwiniwa", "winiwa and xwiniwa", "winiwa vs xwiniwa", "difference between winiwa and xwiniwa", "what is winiwa and xwiniwa"],
      fr: ["que sont winiwa et xwiniwa", "c est quoi winiwa", "c est quoi xwiniwa", "qu est ce que winiwa", "qu est ce que xwiniwa", "winiwa et xwiniwa"],
      de: ["was sind winiwa und xwiniwa", "was ist winiwa", "was ist xwiniwa", "winiwa und xwiniwa"],
      es: ["que son winiwa y xwiniwa", "que es winiwa", "que es xwiniwa", "winiwa y xwiniwa"],
      it: ["cosa sono winiwa e xwiniwa", "cos e winiwa", "cos e xwiniwa", "winiwa e xwiniwa"],
      zh: ["winiwa 和 xwiniwa 是什么", "winiwa和xwiniwa是什么", "什么是 winiwa", "什么是 xwiniwa"]
    },
    answers: {
      en: "Both are real tokens on Minima mainnet, created for this test, and both have no value. Winiwa stands in for Minima itself, the asset people will one day deposit; xWiniwa stands in for the equity side of the protocol, the token that is issued against it. In the test you mint xWiniwa by depositing Winiwa into the on-chain vault one for one, and you burn xWiniwa to get the Winiwa back, at par, with nothing in between. Everything you do with them is practice for the real system, not money and not an investment.",
      fr: "Ce sont deux vrais jetons sur le réseau principal de Minima, créés pour ce test, et tous deux sans valeur. Le Winiwa tient le rôle de Minima lui-même, l'actif que l'on déposera un jour ; le xWiniwa tient le rôle du côté capital du protocole, le jeton émis en contrepartie. Dans le test, vous frappez du xWiniwa en déposant du Winiwa dans le coffre on-chain au taux de un pour un, et vous brûlez du xWiniwa pour récupérer le Winiwa, au pair, sans intermédiaire. Tout ce que vous faites avec eux est un entraînement pour le vrai système, pas de l'argent ni un investissement.",
      de: "Beides sind echte Token im Minima-Hauptnetz, für diesen Test erstellt, und beide sind wertlos. Winiwa steht für Minima selbst, den Wert, den man eines Tages einzahlt; xWiniwa steht für die Eigenkapitalseite des Protokolls, den Token, der dagegen ausgegeben wird. Im Test prägen Sie xWiniwa, indem Sie Winiwa eins zu eins in den On-Chain-Tresor einzahlen, und verbrennen xWiniwa, um Winiwa zum Nennwert zurückzubekommen, ohne Zwischenstation. Alles, was Sie damit tun, ist Übung für das echte System, kein Geld und keine Geldanlage.",
      es: "Ambos son tokens reales en la red principal de Minima, creados para esta prueba, y ambos sin valor. Winiwa hace de Minima, el activo que algún día se depositará; xWiniwa hace del lado de capital del protocolo, el token que se emite a cambio. En la prueba acuñas xWiniwa depositando Winiwa en la bóveda on-chain uno a uno, y quemas xWiniwa para recuperar el Winiwa, a la par, sin nada en medio. Todo lo que hagas con ellos es práctica para el sistema real, no dinero ni una inversión.",
      it: "Sono entrambi token reali sulla rete principale di Minima, creati per questo test, ed entrambi senza valore. Winiwa fa le veci di Minima, l'asset che un giorno si depositerà; xWiniwa fa le veci del lato capitale del protocollo, il token emesso in cambio. Nel test coni xWiniwa depositando Winiwa nel caveau on-chain uno a uno, e bruci xWiniwa per riavere Winiwa, alla pari, senza nulla in mezzo. Tutto ciò che fai con loro è pratica per il sistema reale, non denaro né un investimento.",
      zh: "两者都是为本次测试创建的 Minima 主网真实代币，且都没有价值。Winiwa 扮演 Minima 本身的角色，也就是未来人们存入的资产；xWiniwa 扮演协议的权益一侧，也就是据此发行的代币。在测试中，你把 Winiwa 按一比一存入链上金库来铸造 xWiniwa，再销毁 xWiniwa 按面值换回 Winiwa，中间没有任何环节。你用它们做的一切都是为真实系统做的练习，不是钱，也不是投资。"
    }
  },
  {
    id: "is-my-money-safe",
    variants: {
      en: ["is my money safe", "is it safe", "is stables safe", "is this safe", "can i lose money", "safety", "is my wallet safe", "are my funds safe", "is it secure"],
      fr: ["mon argent est il en securite", "est ce sur", "est ce securise", "stables est il sur", "puis je perdre de l argent", "securite", "mon portefeuille est il en securite"],
      de: ["ist mein geld sicher", "ist es sicher", "ist stables sicher", "kann ich geld verlieren", "sicherheit"],
      es: ["esta seguro mi dinero", "es seguro", "stables es seguro", "puedo perder dinero", "seguridad"],
      it: ["i miei soldi sono al sicuro", "e sicuro", "stables e sicuro", "posso perdere soldi", "sicurezza"],
      zh: ["我的资金安全吗", "安全吗", "stables 安全吗", "会不会亏钱", "安全性"]
    },
    answers: {
      en: "In this test there is no money at stake: Winiwa and xWiniwa have no value, and nothing here is an investment. Your wallet, your node and your keys live inside the Stables app on your own device; Stables never asks for a seed phrase or a vault key, and anyone who does is attacking you. This is an early build, so use a dedicated test wallet or one holding only funds you are willing to risk, never send real value to test-token addresses, keep your recovery details backed up, and update by installing the new version over the old one rather than uninstalling. The code is open at github.com/StablesCouncil for anyone to review.",
      fr: "Dans ce test, aucun argent n'est en jeu : le Winiwa et le xWiniwa n'ont pas de valeur, et rien ici n'est un investissement. Votre portefeuille, votre noeud et vos clés vivent dans l'application Stables, sur votre propre appareil ; Stables ne demande jamais de phrase de récupération ni de clé de coffre, et quiconque le fait vous attaque. C'est une version précoce : utilisez un portefeuille de test dédié ou un portefeuille ne contenant que des fonds que vous acceptez de risquer, n'envoyez jamais de valeur réelle à des adresses de jetons de test, conservez une sauvegarde de vos informations de récupération, et mettez à jour en installant la nouvelle version par-dessus l'ancienne plutôt qu'en désinstallant. Le code est ouvert sur github.com/StablesCouncil, à la disposition de tous.",
      de: "In diesem Test steht kein Geld auf dem Spiel: Winiwa und xWiniwa sind wertlos, und nichts hier ist eine Geldanlage. Ihr Wallet, Ihr Node und Ihre Schlüssel liegen in der Stables-App auf Ihrem eigenen Gerät; Stables fragt nie nach einer Seed-Phrase oder einem Vault-Schlüssel, und wer das tut, greift Sie an. Dies ist eine frühe Version: nutzen Sie ein eigenes Test-Wallet oder eines, das nur Mittel enthält, deren Verlust Sie verkraften, senden Sie nie echten Wert an Test-Token-Adressen, bewahren Sie eine Sicherung Ihrer Wiederherstellungsdaten auf und aktualisieren Sie, indem Sie die neue Version über die alte installieren, statt zu deinstallieren. Der Code ist offen auf github.com/StablesCouncil und kann von jedem geprüft werden.",
      es: "En esta prueba no hay dinero en juego: Winiwa y xWiniwa no tienen valor, y nada de esto es una inversión. Tu billetera, tu nodo y tus claves viven dentro de la aplicación Stables en tu propio dispositivo; Stables nunca pide una frase semilla ni una clave de bóveda, y quien lo haga te está atacando. Es una versión temprana: usa una billetera de prueba dedicada o una que solo tenga fondos que estés dispuesto a arriesgar, nunca envíes valor real a direcciones de tokens de prueba, guarda una copia de tus datos de recuperación y actualiza instalando la nueva versión sobre la anterior en lugar de desinstalar. El código está abierto en github.com/StablesCouncil para que cualquiera lo revise.",
      it: "In questo test non ci sono soldi in gioco: Winiwa e xWiniwa non hanno valore, e niente qui è un investimento. Il tuo portafoglio, il tuo nodo e le tue chiavi vivono dentro l'app Stables sul tuo dispositivo; Stables non chiede mai una frase di recupero né una chiave del caveau, e chiunque lo faccia ti sta attaccando. È una versione iniziale: usa un portafoglio di prova dedicato o uno che contenga solo fondi che sei disposto a rischiare, non inviare mai valore reale a indirizzi di token di prova, conserva una copia dei tuoi dati di recupero e aggiorna installando la nuova versione sopra quella vecchia invece di disinstallare. Il codice è aperto su github.com/StablesCouncil e chiunque può esaminarlo.",
      zh: "在本次测试中没有真正的资金风险：Winiwa 和 xWiniwa 没有价值，这里的一切都不是投资。你的钱包、节点和密钥都保存在你自己设备上的 Stables 应用里；Stables 从不索要助记词或保险库密钥，任何索要的人都是在攻击你。这是一个早期版本：请使用专门的测试钱包，或只存放你愿意承担损失的资金，不要向测试代币地址发送真实价值，妥善备份恢复信息，并通过在旧版本上覆盖安装来更新，而不是卸载。代码在 github.com/StablesCouncil 公开，任何人都可以审阅。"
    }
  },
  {
    id: "where-to-download",
    variants: {
      en: ["where do i download the app", "where to download the app", "download the app", "how do i install the app", "where is the apk", "how to install", "download", "where can i get the app"],
      fr: ["ou telecharger l application", "ou telecharger l app", "telecharger l application", "comment installer l application", "ou est l apk", "telechargement"],
      de: ["wo lade ich die app herunter", "app herunterladen", "wie installiere ich die app", "wo ist die apk"],
      es: ["donde descargo la aplicacion", "descargar la aplicacion", "como instalo la aplicacion", "donde esta el apk"],
      it: ["dove scarico l app", "scaricare l app", "come installo l app", "dov e l apk"],
      zh: ["在哪里下载应用", "下载应用", "如何安装应用", "apk 在哪里"]
    },
    answers: {
      en: "From stablescouncil.org: open Access the app, which is stablescouncil.org/payment-app, and choose the standalone Stables Android app, which runs its own Minima node on your phone, or the Minima Core companion if you already run the official Minima Core Android app. Both files come from the GitHub release with their SHA-256 checksums, so you can verify what you install. Install a new version over the old one and never uninstall, because the wallet stays on the device. The MiniDapp for MinimaOS and the web version come later.",
      fr: "Depuis stablescouncil.org : ouvrez Accéder à l'application, c'est-à-dire stablescouncil.org/payment-app, et choisissez l'application Stables autonome pour Android, qui fait tourner son propre noeud Minima sur votre téléphone, ou le compagnon Minima Core si vous utilisez déjà l'application officielle Minima Core pour Android. Les deux fichiers proviennent de la publication GitHub avec leurs empreintes SHA-256, pour vérifier ce que vous installez. Installez une nouvelle version par-dessus l'ancienne et ne désinstallez jamais, car le portefeuille reste sur l'appareil. Le MiniDapp pour MinimaOS et la version web viendront plus tard.",
      de: "Von stablescouncil.org: öffnen Sie Access the app, also stablescouncil.org/payment-app, und wählen Sie die eigenständige Stables-App für Android, die ihren eigenen Minima-Node auf Ihrem Telefon betreibt, oder den Minima-Core-Begleiter, wenn Sie die offizielle Minima-Core-App für Android bereits nutzen. Beide Dateien stammen aus der GitHub-Veröffentlichung mit ihren SHA-256-Prüfsummen, damit Sie prüfen können, was Sie installieren. Installieren Sie eine neue Version über die alte und deinstallieren Sie nie, denn das Wallet bleibt auf dem Gerät. Die MiniDapp für MinimaOS und die Web-Version folgen später.",
      es: "Desde stablescouncil.org: abre Access the app, es decir stablescouncil.org/payment-app, y elige la aplicación Stables independiente para Android, que ejecuta su propio nodo Minima en tu teléfono, o el compañero de Minima Core si ya usas la aplicación oficial Minima Core para Android. Ambos archivos vienen de la publicación en GitHub con sus sumas SHA-256, para que verifiques lo que instalas. Instala la nueva versión sobre la anterior y nunca desinstales, porque la billetera se queda en el dispositivo. La MiniDapp para MinimaOS y la versión web llegarán más adelante.",
      it: "Da stablescouncil.org: apri Access the app, cioè stablescouncil.org/payment-app, e scegli l'app Stables autonoma per Android, che esegue il proprio nodo Minima sul tuo telefono, oppure il compagno Minima Core se usi già l'app ufficiale Minima Core per Android. Entrambi i file provengono dalla release su GitHub con i loro checksum SHA-256, così puoi verificare ciò che installi. Installa la nuova versione sopra quella vecchia e non disinstallare mai, perché il portafoglio resta sul dispositivo. La MiniDapp per MinimaOS e la versione web arriveranno più avanti.",
      zh: "从 stablescouncil.org 下载：打开 Access the app（即 stablescouncil.org/payment-app），选择独立版 Stables 安卓应用（在你的手机上运行自己的 Minima 节点），或者如果你已经在用官方的 Minima Core 安卓应用，就选择 Minima Core 伴侣版。两个文件都来自 GitHub 发布页并附有 SHA-256 校验值，便于核对。更新时请在旧版本上覆盖安装，切勿卸载，因为钱包保存在设备上。MinimaOS 版 MiniDapp 和网页版将在之后推出。"
    }
  }
];

const LANGS = ["en", "fr", "de", "es", "it", "zh"];

/* Lowercase, no accents, no punctuation, single spaces: "Qu'est-ce que Stables ?" and "qu est ce
   que stables" are the same question. Chinese has no case and no accents; punctuation still goes. */
function normalise(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[’'`´]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Find a prepared answer for a question. Returns { id, lang, answer } or null.
 * @param {string} question  what the person typed or tapped
 * @param {string} langHint  the client's language code when it has one (the chat page sends it)
 */
function matchFaq(question, langHint) {
  const q = normalise(question);
  if (!q) return null;
  const words = q.split(" ").length;
  const hint = String(langHint || "").toLowerCase().slice(0, 2);
  const preferred = LANGS.includes(hint) ? hint : (hint === "fr" ? "fr" : null);
  for (const entry of FAQ) {
    for (const lang of LANGS) {
      for (const v of entry.variants[lang] || []) {
        const nv = normalise(v);
        if (!nv) continue;
        const exact = q === nv;
        const contained = words <= 6 && nv.split(" ").length >= 2 && (" " + q + " ").includes(" " + nv + " ");
        if (exact || contained) {
          const answerLang = entry.answers[lang] ? lang : "en";
          /* A tapped topic arrives in the page's language; a typed question in another language
             than the page is answered in the language it was asked in. */
          const chosen = (preferred && entry.answers[preferred] && lang === preferred) ? preferred : answerLang;
          return { id: entry.id, lang: chosen, answer: entry.answers[chosen] };
        }
      }
    }
  }
  return null;
}

/** Does a model reply say, in effect, "I do not know"? Used to retry or replace, never shown.
 *  Short replies count too: "I do not know." is the worst case, not an exception. */
const REFUSAL_RE = new RegExp([
  // English
  "\\bi (do not|don't|dont|do n't) know\\b",
  "\\bi(?: am|'m| m) not (sure|certain|able)\\b",
  "\\b(cannot|can't|cant|unable to|not able to) (answer|help|tell|say|find|provide|determine|confirm)",
  "(don't|do not|doesn't|does not) have (enough |any |the |specific |sufficient )?(information|context|details|data|knowledge)",
  "\\bno (specific |sufficient |enough |relevant )?(information|context|details|data) (about|on|regarding|available|is available|provided)",
  "\\bnot (enough |sufficient )?(information|context) (in|from|within) the",
  "\\bthe (provided |given |available )?(context|information|documents?|knowledge base|sources?) (does not|doesn't|do not|don't) (address|contain|cover|mention|include|specify|provide|say)",
  "\\b(is|are) not (mentioned|specified|covered|addressed|provided|available|described|included) (in|by) the",
  "\\b(beyond|outside) (my|the) (knowledge|scope|information|context)",
  "\\bplease (refer|check|consult|contact)\\b.{0,60}\\bofficial\\b.{0,40}\\bfor (information|details|more)",
  // French
  "je ne sais pas", "je ne (peux|puis) pas (répondre|repondre|vous aider|vous répondre)", "je n'ai pas (assez d'|d'|suffisamment d'|les )informations", "le contexte (fourni )?ne (contient|mentionne|couvre|précise|precise|permet)", "(aucune|pas d') ?information (sur|à ce sujet|a ce sujet|disponible)",
  // Spanish
  "no (lo )?sé(?!\\p{L})", "no puedo (responder|ayudar|confirmar)", "no tengo (suficiente |la |esa |esta )?informaci", "el contexto (proporcionado )?no (contiene|menciona|cubre|incluye|aborda)",
  // German
  "ich (weiß|weiss) (es )?nicht", "(kann|könnte|koennte) ich (das |dies |diese frage )?nicht beantworten", "ich habe (nicht genug|keine|nicht genügend|nicht genuegend) informationen", "der (bereitgestellte )?kontext (enthält|enthalt|behandelt|erwähnt|erwaehnt|nennt) (nicht|keine)",
  // Italian
  "non (lo )?so\\b", "non posso (rispondere|aiutar|confermare)", "non ho (abbastanza |sufficienti |queste |le )?informazioni", "il contesto (fornito )?non (contiene|menziona|copre|include|specifica)",
  // Chinese
  "我不知道", "无法回答", "没有(足够的|相关|这方面的)?信息", "无法(确定|确认|提供)"
].join("|"), "iu");
function looksLikeRefusal(text) {
  const t = String(text || "").toLowerCase().normalize("NFC");
  if (t.length < 3) return false;
  return REFUSAL_RE.test(t);
}

/* Words that carry no topic, so that "is my money safe" and "how safe is my wallet" meet on
   "money", "safe", "wallet". */
const STOP = new Set(("a an and are as at be but by can could do does for from get have how i in is it its me my of on or that the this to what when where which who why will with you your " +
  "le la les de des du un une et est ce que qui quoi comment mon ma mes je tu vous il elle on ne pas se " +
  "el la los las de del un una y es que como mi mis yo tu se no " +
  "der die das den dem ein eine und ist was wie mein meine ich du sie es nicht " +
  "il lo la i gli le di del un una e che come mio mia io tu si non").split(" "));
function contentWords(text) { return normalise(text).split(" ").filter((w) => w && w.length > 1 && !STOP.has(w)); }

/**
 * The prepared answer closest to a question, for the moments when the model has failed: a
 * timeout, an empty reply, a refusal twice. Returns { id, lang, answer, score } or null.
 * The bar is deliberate: at least half of the question's content words must appear in one of
 * an entry's phrasings, and at least one word must match. Chinese questions match by substring.
 */
function nearestFaq(question, langHint) {
  const qWords = contentWords(question);
  const raw = normalise(question);
  const hint = String(langHint || "").toLowerCase().slice(0, 2);
  const preferred = LANGS.includes(hint) ? hint : null;
  let best = null;
  for (const entry of FAQ) {
    for (const lang of LANGS) {
      for (const v of entry.variants[lang] || []) {
        let score = 0;
        if (lang === "zh") {
          const nv = normalise(v).replace(/\s+/g, "");
          const nq = raw.replace(/\s+/g, "");
          if (nv && nq && (nq.includes(nv) || nv.includes(nq))) score = 1;
        } else {
          const vw = new Set(contentWords(v));
          if (!qWords.length || !vw.size) continue;
          const hits = qWords.filter((w) => vw.has(w)).length;
          score = hits / Math.max(qWords.length, 1);
          if (hits === 0) score = 0;
        }
        if (score > (best ? best.score : 0)) {
          const answerLang = (preferred && entry.answers[preferred]) ? preferred : (entry.answers[lang] ? lang : "en");
          best = { id: entry.id, lang: answerLang, answer: entry.answers[answerLang], score };
        }
      }
    }
  }
  return best && best.score >= 0.5 ? best : null;
}

/** The prepared answer for a topic the person tapped (the page sends the id), in the page's language. */
function faqById(id, langHint) {
  const entry = FAQ.find((e) => e.id === String(id || ""));
  if (!entry) return null;
  const hint = String(langHint || "").toLowerCase().slice(0, 2);
  const lang = (LANGS.includes(hint) && entry.answers[hint]) ? hint : "en";
  return { id: entry.id, lang, answer: entry.answers[lang] };
}

/** What to say when the model gave nothing usable: the nearest prepared answer, else the core facts. */
function bestEffortAnswer(question, langHint, lead) {
  const near = nearestFaq(question, langHint);
  if (near) return (lead ? lead + " This is the prepared answer closest to your question. " : "") + near.answer;
  return (lead ? lead + " " : "") + "Here is what is always true about Stables. " + STABLES_CORE_FACTS.split("\n").slice(1).join(" ") + " For anything beyond this, the Council's official channels at stablescouncil.org are the place to ask.";
}

module.exports = { STABLES_CORE_FACTS, FAQ, matchFaq, looksLikeRefusal, normalise, nearestFaq, faqById, bestEffortAnswer };
