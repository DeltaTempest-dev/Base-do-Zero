// =====================================
// BASE INICIAL CONNECT ❤️
// =====================================

const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion,
jidNormalizedUser
} = require("@whiskeysockets/baileys")

const fs = require("fs")
const { Boom } = require("@hapi/boom")
const pino = require("pino")
const readline = require("readline")
const colors = require("colors")
const { NumberDono, prefix, NickDono, NomeBot } = require("./Base-config/dono")
const { Tokito_site, API_KEY_TOKITO } = require("./Base-config/apikey")

let handler = require("./index")

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
})

function limparNumero(numero) {
return numero.replace(/\D/g, "")
}

// ===================== AUTO RELOAD =====================
fs.watchFile(require.resolve("./index"), () => {
delete require.cache[require.resolve("./index")]
handler = require("./index")
console.log(colors.green("🔄 index.js atualizado automaticamente 💁‍♂️"))
})

async function iniciarBot() {
const { state, saveCreds } =
await useMultiFileAuthState("./database/Base-QR")

const { version } =
await fetchLatestBaileysVersion()

console.clear()

console.log(`
╔══════════════════════════╗
║      ❤️ BASE BOT ❤️      ║
╚══════════════════════════╝

🩸 Iniciando sistema...
`)

const sock = makeWASocket({
version: [2, 3000, 1042650569],
auth: state,
printQRInTerminal: false,
logger: pino({ level: "silent" }),
browser: ["Ubuntu", "Chrome", "20.0.04"]
})

sock.ev.on("creds.update", saveCreds)

// ===================== MENSAGENS =====================
sock.ev.on("messages.upsert", async ({ messages }) => {
try {
const msg = messages?.[0]

if (!msg?.message) return
if (msg.key.remoteJid === "status@broadcast") return
if (msg.key.fromMe) return

await handler(sock, { messages })

} catch (err) {
console.log("❌ Erro no messages.upsert")
console.log(err)
}
})

// ================= EVENTO BEM-VINDO / SAIU =================
sock.ev.on("group-participants.update", async (adszin) => {
try {
const groupId = adszin.id

const pathCfg =
`./Base-config/Groups/activated_groups/${groupId}.json`

if (!fs.existsSync(pathCfg)) return

const jsonGp =
JSON.parse(fs.readFileSync(pathCfg))

// CONTROLE GERAL
const ativo =
jsonGp?.[0]?.wellcome?.some(
(w) =>
w?.bemvindo1 === true ||
w?.bemvindo2 === true
)

if (!ativo) return

const cfg1 =
jsonGp?.[0]?.wellcome?.[0]

const cfg2 =
jsonGp?.[0]?.wellcome?.[1]

let meta

try {
meta =
await sock.groupMetadata(groupId)
} catch {
return
}

const desc = meta.desc || ""

const horaAgora =
new Date().toLocaleTimeString(
"pt-BR",
{
hour: "2-digit",
minute: "2-digit"
}
)

for (const userRaw of adszin.participants) {
const user =
jidNormalizedUser(userRaw)

// FOTO
let foto

try {
foto =
await sock.profilePictureUrl(
user,
"image"
)
} catch {
foto =
"https://telegra.ph/file/24fa902ead26340f3df2c.png"
}

const replace = (txt = "") =>
txt
.replace("#hora#", horaAgora)
.replace("#nomedogp#", meta.subject)
.replace(
"#numerodele#",
"@" + user.split("@")[0]
)
.replace(
"#numerobot#",
sock.user.id.split(":")[0]
)
.replace("#prefixo#", prefix)
.replace("#descrição#", desc)

// ========= ENTROU =========
if (adszin.action === "add") {

// bemvindo1 = TEXTO E IMAGEM
if (
cfg1?.bemvindo1 &&
cfg1?.legendabv
) {
const fundo =
encodeURIComponent(
"https://raw.githubusercontent.com/DeltaTempest-dev/uploads/main/175ygt.jpeg"//add o fundo
)

const avatar =
encodeURIComponent(foto)

const titulo =
encodeURIComponent(
"Seja Bem-vindo(a)!"
)

const sub =
encodeURIComponent(
`Ao grupo: ${meta.subject}`
)

const welcomeImage =
`https://tokito-apis.site/canvas/welcome` +
`?fundo=${fundo}` +
`&avatar=${avatar}` +
`&titulo=${titulo}` +
`&sub=${sub}` +
`&apikey=${API_KEY_TOKITO}`

await sock.sendMessage(
groupId,
{
image: {
url: welcomeImage
},
caption: replace(
cfg1.legendabv
),
mentions: [user]
}
)
}

// bemvindo2 = TEXTO
if (
cfg2?.bemvindo2 &&
cfg2?.legendabv
) {
await sock.sendMessage(
groupId,
{
text: replace(
cfg2.legendabv
),
mentions: [user]
}
)
}
}

// ========= SAIU =========
if (adszin.action === "remove") {

// saída imagem
if (cfg1?.legendasaiu) {
await sock.sendMessage(
groupId,
{
image: { url: foto },
caption: replace(
cfg1.legendasaiu
),
mentions: [user]
}
)

// fallback texto
} else if (
cfg2?.legendasaiu
) {
await sock.sendMessage(
groupId,
{
text: replace(
cfg2.legendasaiu
),
mentions: [user]
}
)
}
}
}

} catch (e) {
console.error(
colors.red(
"[ERRO BEM-VINDO]: "
),
e
)
}
})

// ===================== PAIR CODE =====================
if (!sock.authState.creds.registered) {
rl.question(
"📱 Digite seu número (Ex: 553498119617): ",
async (numero) => {
try {
const cleanNumber =
limparNumero(numero)

console.log("\n⏳ Gerando código...\n")

const code =
await sock.requestPairingCode(
cleanNumber
)

console.log(`
💛 Código:

${code.match(/.{1,4}/g)?.join("-") || code}

📲 WhatsApp > Aparelhos conectados
`)

} catch (e) {
console.log(`
❌ Erro ao gerar código!

${e?.message || e}
`)
}
}
)
}

// ===================== CONEXÃO =====================
sock.ev.on(
"connection.update",
async (update) => {
const {
connection,
lastDisconnect
} = update

if (connection === "open") {
console.log(
"🟢 Status: conectado"
)
}

if (connection === "close") {
const reason =
new Boom(
lastDisconnect?.error
)?.output?.statusCode

console.log(
"🔴 Conexão fechada. Código:",
reason
)

if (
reason ===
DisconnectReason.loggedOut
) {
console.log(`
🔴 Sessão encerrada!

🗑️ Apague a pasta:
→ ./database/Base-QR
`)

process.exit(0)

} else {
console.log(`
🟡 Reconectando em 3 segundos...
`)

setTimeout(() => {
iniciarBot()
}, 3000)
}
}
}
)
}

iniciarBot()