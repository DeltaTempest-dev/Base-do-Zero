/* BASE CRIADA DO ZERO PARA INICIANTES NA PROGRAMAÇÃO 
TODOS OS CRÉDITOS VÃO PARA DYLAN, ADRENIS E EQUIPE TOKITO API'S
FAÇA OQ QUISER COM A BASE NÃO NÓS RESPONSABILIZAMOS.
BASE NÃO TEM SUPORTE, ENTÃO DÊ SEUS PULOS.
© Equipe Tokito Api's - 2026*/

const { NumberDono, prefix, NickDono, NomeBot } = require("./Base-config/dono")
const { Tokito_site, API_KEY_TOKITO } = require("./Base-config/apikey")

const { fs, axios, moment, linguagem, mess, getBuffer, fetchJson, downloadContentFromMessage, downloadMediaMessage, prepareWAMessageMedia, jidNormalizedUser, getContentType, setting } = require("./Base-config/exports")



//=====FUNÇÕES AUXILIARES=====\\by: Adrenis Modz KKKKKKK 
function normalizeJid(jid) {
if (typeof jid !== "string") return null;

let id = jid.replace(/:.*(?=@)/, "");

if (id.endsWith("@lid")) {
id = id.replace("@lid", "@s.whatsapp.net");
} else if (!id.endsWith("@s.whatsapp.net")) {
id += "@s.whatsapp.net";
}

return id;
}

// ===================== ADMINS DO GRUPO =====================
function getGroupAdmins(participants = []) {
return participants
.filter(p => p && (p.admin === "admin" || p.admin === "superadmin"))
.map(p => {
let jidReal = null;

if (typeof p.jid === "string") {  
    jidReal = p.jid;  
  } else if (typeof p.participantPn === "string") {  
    jidReal = p.participantPn;  
  } else if (typeof p.participant === "string") {  
    const part = p.participant.split(":")[0];  
    jidReal = part.endsWith("@s.whatsapp.net")  
      ? part  
      : part + "@s.whatsapp.net";  
  }  

  return normalizeJid(jidReal);  
})  
.filter(Boolean);

}

// ===================== MEMBROS DO GRUPO =====================
function getMembros(participants = []) {
return participants
.filter(p => p && !p.admin)
.map(p => {
let jidReal = null;

if (typeof p.jid === "string") {  
    jidReal = p.jid;  
  } else if (typeof p.participantPn === "string") {  
    jidReal = p.participantPn;  
  } else if (typeof p.participant === "string") {  
    const part = p.participant.split(":")[0];  
    jidReal = part.endsWith("@s.whatsapp.net")  
      ? part  
      : part + "@s.whatsapp.net";  
  }  

  return normalizeJid(jidReal);  
})  
.filter(Boolean);

}


//HANDLER 
module.exports = async (base, m) => {
try {

const msg = m.messages?.[0];
if (!msg) return;
if (msg.key?.fromMe) return;
const message =
msg.message?.ephemeralMessage?.message ||
msg.message?.viewOnceMessage?.message ||
msg.message;
if (!message) return;
const info = m.messages?.[0];
if (!info) return;
const from = info.key?.remoteJid;
if (!from) return;
const pushname = info?.pushName || await base?.user?.name || "Usuário";
const quoted = info.quoted ? info.quoted : info
const isGroup = from.endsWith("@g.us")
const sender = jidNormalizedUser(isGroup ? info?.key?.participantPn || 
info?.key?.senderPn || 
await base?.user?.id || 
info?.key?.participant : info?.key?.senderPn || 
info?.key?.participant ||
info?.key?.remoteJid 
);

const senderNumber = sender.split('@')[0];

let groupMetadata = {}

if (isGroup) {
groupMetadata = await base.groupMetadata(from)
}

function normalizar(alvo) {
    if (!alvo) return "";

    alvo = alvo.replace(/:.*(?=@)/, "");

    if (alvo.endsWith("@lid")) {
        return alvo.replace("@lid", "@s.whatsapp.net");
    }

    if (!alvo.includes("@")) {
        return alvo + "@s.whatsapp.net";
    }

    return alvo;
}

const jid = normalizeJid(sender);
const numero = jid.replace(/@.+/, "");

const reply = (text) => {
return base.sendMessage(from, {
text: text
}, {
quoted: msg
})
}

const reagir = async (emoji) => {
await base.sendMessage(from, {
react: {
text: emoji,
key: msg.key
}
})
}


if (isGroup && groupMetadata?.participants) {
const contato = groupMetadata.participants.find(p => {
const id = normalizeJid(
p.id ||
p.jid ||
p.participant
);
return id === jid;
});
}


//====SISTEMA DE DONO====\\
const botNumber = jidNormalizedUser(base.user.id);

const supre = "553498119617@s.whatsapp.net";

const isBot = info.key.fromMe ? true : false

const botNumberLID = base?.user?.lid?.split(':')[0] + '@lid' || '';

const MeuNumero = jidNormalizedUser(String(NumberDono).trim() + '@s.whatsapp.net');

const SoDono = jidNormalizedUser(sender) === MeuNumero;

const groupMembers = isGroup ? groupMetadata.participants : [];

const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : [];

const somembros = isGroup ? getMembros(groupMembers) : [];


// ─── PASTA E CACHE DE GRUPOS ──────────────────────
const pastaGrupo = "./Base-config/Groups/activated_groups";

if (!fs.existsSync(pastaGrupo)) {
fs.mkdirSync(pastaGrupo, { recursive: true });
}

const groupCache = global.groupCache || new Map();
global.groupCache = groupCache;


async function getGroupMetadataSafe(id) {
if (groupCache.has(id)) return groupCache.get(id);

try {
const metadata = await base.groupMetadata(id);
groupCache.set(id, metadata);

setTimeout(() => groupCache.delete(id), 5 * 60 * 1000);

return metadata;
} catch (err) {
console.log(
err?.data === 429
? "⚠️ Rate limit (429) ao buscar metadata."
: "Erro ao buscar metadata:",
err
);
return {};
}
}

//=====VARIÁVEIS DE GRUPO=====\\ by:Adrenis -_-
let Infos_Do_Grupo = {};
let NomeGrupo = '';
let DescGp = '';
let MembrosGP = [];
let Dono_Do_Grupo = '';

if (isGroup) {
Infos_Do_Grupo = await getGroupMetadataSafe(from);
NomeGrupo = Infos_Do_Grupo?.subject || '';
DescGp = Infos_Do_Grupo?.desc || '';
MembrosGP = Infos_Do_Grupo?.participants || [];
Dono_Do_Grupo = Infos_Do_Grupo?.owner || '';
}

//=====JSON POR GRUPO=====\\
const dirGroup = `${pastaGrupo}/${from}.json`;

if (isGroup && !fs.existsSync(dirGroup)) {
const dataGp2 = [{
name: NomeGrupo,
groupId: from,

wellcome: [
{
bemvindo1: false,
legendabv: "✨ Olá #numerodele#!\nSeja muito bem-vindo(a) ao Grupo: *#nomedogp#* ❤️\nAproveite sua estadia e divirta-se!\n🩸 Bot Inicial te deseja boas-vindas!",
legendasaiu: "😢 Adeus #numerodele#...\nFoi bom ter você no Grupo: *#nomedogp#*.\nVolte quando quiser, as portas estarão abertas! ❤️"
},
{
bemvindo2: false,
legendabv:"✨ Olá #numerodele#!\nSeja muito bem-vindo(a) ao Grupo: *#nomedogp#* ❤️\nAproveite sua estadia e divirta-se!\n🩸 Bot Inicial te deseja boas-vindas!",
legendasaiu: "😢 Adeus #numerodele#...\nFoi bom ter você no Grupo: *#nomedogp#*.\nVolte quando quiser, as portas estarão abertas! ❤️"
}
]
}];

fs.writeFileSync(dirGroup, JSON.stringify(dataGp2, null, 2));
}


function setGp(index){
fs.writeFileSync(dirGroup, JSON.stringify(index, null, 2) + '\n')}

function setNes(index){
fs.writeFileSync(nescj, JSON.stringify(index, null, 2) + '\n')}

// ====== LER DADOS DO GRUPO ======
let dataGp = []

if (isGroup && fs.existsSync(dirGroup)) {
  try {
    dataGp = JSON.parse(fs.readFileSync(dirGroup))
  } catch (e) {
    console.log('[ERRO JSON GRUPO]:', e)
    dataGp = []
  }
}

function setGp(dados) {
  if (!isGroup) return
  if (!dirGroup) return

  fs.writeFileSync(dirGroup, JSON.stringify(dados, null, 2))
}

//Flags

const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;

const isGroupAdmins = Array.isArray(groupAdmins) && groupAdmins.includes(sender);

const isBemvindo       = isGroup ? dataGp[0]?.wellcome?.[0]?.bemvindo1  : false

const isBemvindo2      = isGroup ? dataGp[0]?.wellcome?.[1]?.bemvindo2 : false



const body =
msg.message?.conversation ||
msg.message?.extendedTextMessage?.text ||
msg.message?.imageMessage?.caption ||
msg.message?.videoMessage?.caption ||
"";

const prefix = setting.prefix;

const isCmd = body.trim().startsWith(prefix);

const args = isCmd
  ? body.trim().slice(prefix.length).trim().split(/\s+/)
  : [];

const command = args.shift()?.toLowerCase() || "";

const q = args.join(" ");


const hora = moment().tz("America/Sao_Paulo").format("HH:mm:ss");
const data = moment().tz("America/Sao_Paulo").format("DD/MM/YYYY");


//SIMILARIDADEZ by: DEV|Adrenis -_-
function SimilarComandos(word1, word2) {
function generateNGrams(word, n) {
const nGrams = [];
for (let i = 0; i < word.length - n + 1; i++) {
nGrams.push(word.slice(i, i + n));
}
return nGrams;
}
 
const nGrams1 = generateNGrams(word1, 2);
const nGrams2 = generateNGrams(word2, 2);
const commonNGrams = nGrams1.filter(nGram => nGrams2.includes(nGram));
const similarity = Math.round((2 * commonNGrams.length) / (nGrams1.length + nGrams2.length) * 100);
return similarity;
}
const ListaComandos = (targetWord) => {
const fileContent = fs.readFileSync("index.js", "utf8");
const commandsRegex = /case\s+['"](.+?)['"]/g;
let mostSimilarCommand = "";
let highestSimilarity = -1;
let match;
  
while ((match = commandsRegex.exec(fileContent)) !== null) {
const extractedCommand = match[1];
const similarity = SimilarComandos(targetWord, extractedCommand);
if (similarity > highestSimilarity) {
highestSimilarity = similarity;
mostSimilarCommand = extractedCommand;
}
 }
return {
command: mostSimilarCommand, 
similarity: highestSimilarity
};
};


const numClean = (txt = "") =>
txt.replace(/[()+\-\/\s]/g, "") +
"@s.whatsapp.net"

const menc_sticker =
info?.mentionedJid?.length > 0
? normalizar(info.mentionedJid[0])
: normalizar(
msg?.message?.stickerMessage
?.contextInfo?.participant
) || null

let menc_prt =
msg?.message?.extendedTextMessage
?.contextInfo?.participant ||
msg?.message?.stickerMessage
?.contextInfo?.participant ||
""

menc_prt = normalizar(menc_prt)

const menc_jid2 =
msg?.message?.extendedTextMessage
?.contextInfo?.mentionedJid ||
msg?.message?.stickerMessage
?.contextInfo?.mentionedJid ||
[]

if (menc_jid2?.length > 0) {
menc_jid2[0] =
normalizar(menc_jid2[0])
}

const menc_os2 =
q.includes("@")
? (menc_jid2?.[0] || menc_sticker)
: menc_prt || menc_sticker

const menc_jid =
normalizar(menc_os2 || sender)

const mrc_ou_numero =
q.length > 6 && !q.includes("@")
? numClean(q)
: normalizar(menc_prt)

const marc_tds =
q.includes("@")
? normalizar(menc_jid)
: q.length > 6 && !q.includes("@")
? numClean(q)
: normalizar(menc_prt)

const menc_prt_nmr =
q.length > 12 && !q.includes("@")
? numClean(q)
: normalizar(menc_prt)

const sender_ou_n =
q.includes("@")
? menc_jid2?.[0]
: (menc_prt || sender)

const sender_ou_n3 =
q.includes("@")
? menc_jid
: sender

const menc_os23 =
q.includes("@")
? menc_jid
: menc_prt

const mrc_ou_numero3 =
q.length > 6 && !q.includes("@")
? q.replace(/[()+\-\/\s]/g, "") +
"@s.whatsapp.net"
: menc_prt

const marc_tds3 =
q.includes("@")
? menc_jid
: q.length > 6 && !q.includes("@")
? q.replace(/[()+\-\/\s]/g, "") +
"@s.whatsapp.net"
: menc_prt

const menc_prt_nmr3 =
q.length > 12
? q.replace(/[()+\-\/\s]/g, "") +
"@s.whatsapp.net"
: menc_prt

const mentions = async (
teks,
membros = []
) => {
membros = [...new Set(membros)]

await base.sendMessage(from, {
text: teks.trim(),
mentions: membros
})
}

const mention = async (
teks = "",
ms = msg
) => {
let memberr = []

let linhas = teks.split("\n")

for (let linha of linhas) {
let palavras = linha.split(" ")

for (let palavra of palavras) {
if (palavra.startsWith("@")) {
let numero =
palavra.replace(/[^0-9]/g, "")

if (numero.length > 5) {
memberr.push(
numero + "@s.whatsapp.net"
)
}
}
}
}

memberr = [...new Set(memberr)]

await base.sendMessage(
from,
{
text: teks.trim(),
mentions: memberr
},
{
quoted: ms
}
)
}

const Slimemenus = fs.readFileSync("./Base-config/FotoMenu/menus.png");

// ===================== TIPO DE MENSAGEM =====================
const type = Object.keys(msg.message || {})[0]

const isText =
type === "conversation" ||
type === "extendedTextMessage"

const isImage = type === "imageMessage"
const isVideo = type === "videoMessage"
const isAudio = type === "audioMessage"
const isDocument = type === "documentMessage"
const isSticker = type === "stickerMessage"
const isReaction = type === "reactionMessage"

let tipoMsg = "DESCONHECIDO"

if (isText) tipoMsg = "TEXTO"
else if (isImage) tipoMsg = "IMAGEM"
else if (isVideo) tipoMsg = "VÍDEO"
else if (isAudio) tipoMsg = "ÁUDIO"
else if (isDocument) tipoMsg = "DOCUMENTO"
else if (isSticker) tipoMsg = "STICKER"
else if (isReaction) tipoMsg = "REAÇÃO"

// ===================== LOG =====================
if (isGroup) {
console.log(`
╭━━━〔 📩 MENSAGEM DE GRUPO 〕━━━⬣
┃ 👤 Nome     : ${pushname}
┃ 📱 Número   : ${numero}
┃ 👥 Grupo    : ${groupMetadata?.subject || "Desconhecido"}
┃ 📦 Tipo     : ${tipoMsg}
┃ 💬 Texto    : ${body || "Sem texto"}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣
`)
}



console.log(`
╭━━━〔 ⚡ COMANDO EXECUTADO 〕━━━⬣
┃ 👤 Nome      : ${pushname}
┃ 📱 Número    : ${numero}
┃ ⚙️ Comando   : ${prefix + command}
┃ 📦 Tipo      : ${tipoMsg}
┃ 👥 Local     : ${isGroup ? groupMetadata?.subject : "Privado"}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━⬣
`)


if (body.trim().toLowerCase() === "prefixo") {
    await reagir("❤️");
    reply(`❤️ Meu prefixo é: *${prefix}*`);
}
if (!isCmd) return

/*if (!from.endsWith('@g.us')) {
  return reply('❌ O bot funciona apenas em grupos.')}*/

switch (command) {

//comandos de dono
case "r":
case "restart":
case "reiniciar": {
if (!SoDono) return reply("😠Hm só meu mestre que pode usar>.<💧")
await reagir("❤️")
await base.sendMessage(from, {
text: "🔄 Reiniciando Base Inicial"
})
process.exit(0)
}
break

case 'prefixo-bot':
case 'setprefix':
if (args.length < 1) return;
if (!SoDono) return reply("😠Hm só meu mestre que pode usar>.<💧")
const novoPrefix = q.trim();
setting.prefix = novoPrefix;
fs.writeFileSync("./Base-config/dono.json", JSON.stringify(setting, null, 4));
reply(`✔ Prefixo alterado para: *${novoPrefix}*`);
break;

case 'verkey':{
if (!SoDono) return reply("😠Hm só meu mestre que pode usar>.<💧")
await reagir("⏳");
try {
const { data } = await axios.get(
`${Tokito_site}/api/status/key?apikey=${API_KEY_TOKITO}`,
{ timeout: 10000 }
);

if (!data?.status) {
await reagir(from, "❌");
return reply(data?.mensagem || "Não foi possível consultar a key.");
}
const { requisicoes } = data;
await reagir("✅");
reply(`🧊 *TOKITO API'S*\n> 🟢 *Requisições disponíveis:* ${requisicoes.disponiveis}`);
} catch (err) {
console.error("[KEY]", err);
await reagir(from, "❌");
reply(`⚠️ ${err.response?.data?.mensagem || err.message}`);
}
}
break;

//comando de ADM 

case "ban": {
if (!isGroup) return reply("❌ Esse comando só funciona em grupos.")
if (!isGroupAdmins) return reply("❌ Apenas administradores podem usar.")
if (!isBotGroupAdmins) return reply("❌ Preciso ser administrador do grupo.")

const user =
marc_tds ||
menc_jid ||
(msg.quoted ? msg.quoted.sender : null)

if (!user) {
return reply(
`Marque, responda ou digite o número.\nExemplo: ${prefix}ban @membro`
)
}

if (user === botNumber) {
return reply("❌ Não posso me remover.")
}

try {

await base.groupParticipantsUpdate(
from,
[user],
"remove"
)

await mention(
`✅ Usuário removido do grupo: @${user.split("@")[0]}`
)

} catch (e) {
console.log(e)
reply("❌ Erro ao remover o usuário.")
}
}
break

case 'bemvindo':
case 'welcome':
if (!isGroup) return reply("❌ Esse comando só funciona em grupos.")
if (!isGroupAdmins) return reply("❌ Apenas administradores podem usar.")
if (!isBotGroupAdmins) return reply("❌ Preciso ser administrador do grupo.")
if(args.length < 1) return reply('1 pra ligar / 0 pra desligar')
if(Number(args[0]) === 1) {
if(isBemvindo) return reply('Ja esta ativo')
dataGp[0].wellcome[0].bemvindo1 = true
setGp(dataGp)
reply("BEM-VINDO ATIVADO COM SUCESSO ❤️")
} else if(Number(args[0]) === 0) {
if(!isBemvindo) return reply('Ja esta Desativado')
dataGp[0].wellcome[0].bemvindo1 = false
setGp(dataGp)
reply("BEM-VINDO DESATIVADO COM SUCESSO ❤️")
} else {
reply('1 para ativar, 0 para desativar')
}
break

case 'legendabv':  
if (!isGroup) return reply("❌ Esse comando só funciona em grupos.")
if (!isGroupAdmins) return reply("❌ Apenas administradores podem usar.")
if (!isBotGroupAdmins) return reply("❌ Preciso ser administrador do grupo.")
if(args.length < 1) return reply('*Escreva a mensagem de boas-vindas*')
teks = body.slice(11)
if(isBemvindo) {
dataGp[0].wellcome[0].legendabv = teks
setGp(dataGp)
reply('*Mensagem de boas vindas definida com sucesso!*')
} else {
reply(`Ative o ${prefix}bemvindo 1`)
}
break

case 'legendasaiu':
if (!isGroup) return reply("❌ Esse comando só funciona em grupos.")
if (!isGroupAdmins) return reply("❌ Apenas administradores podem usar.")
if (!isBotGroupAdmins) return reply("❌ Preciso ser administrador do grupo.")
if(args.length < 1) return reply('*Escreva a mensagem de saída*')
teks = body.slice(13)
if(isBemvindo) {
dataGp[0].wellcome[0].legendasaiu = teks
setGp(dataGp)
reply('*Mensagem de saída definida com sucesso!*')
} else {
reply(`Ative o ${prefix}bemvindo 1`
)
}
break

case 'welcome2':
case 'bemvindo2':
if (!isGroup) return reply("❌ Esse comando só funciona em grupos.")
if (!isGroupAdmins) return reply("❌ Apenas administradores podem usar.")
if (!isBotGroupAdmins) return reply("❌ Preciso ser administrador do grupo.")
if(!args[0]) return reply(`Digite:\n${prefix + command} 1 para ativar\n${prefix + command} 0 para desativar`)
if(Number(args[0]) === 1){
if(isBemvindo2) return reply('O recurso já está ativado.')
dataGp[0].wellcome[1].bemvindo2 = true
setGp(dataGp)
reply("Modo bem-vindo 2 ativado com sucesso 𓆩❤️𓆪")
} else if(Number(args[0]) === 0){
if(!isBemvindo2) return reply('O recurso já está desativado.')
dataGp[0].wellcome[1].bemvindo2 = false
setGp(dataGp)
reply("Modo bem-vindo 2 desativado com sucesso 𓆩❤️𓆪")
} else {
reply(`Use ${prefix + command} 1 para ativar ou 0 para desativar`)
}
break

case 'legendabv2':
if (!isGroup) return reply("❌ Esse comando só funciona em grupos.")
if (!isGroupAdmins) return reply("❌ Apenas administradores podem usar.")
if (!isBotGroupAdmins) return reply("❌ Preciso ser administrador do grupo.")
if(!q) return reply('*Escreva a mensagem de boas-vindas*')
if(isBemvindo2){
dataGp[0].wellcome[1].legendabv = q
setGp(dataGp)
reply('*Mensagem de boas-vindas definida com sucesso!*')
} else {
reply(`Ative o ${prefix}bemvindo2 1`)
}
break

case 'legendasaiu2':
if (!isGroup) return reply("❌ Esse comando só funciona em grupos.")
if (!isGroupAdmins) return reply("❌ Apenas administradores podem usar.")
if (!isBotGroupAdmins) return reply("❌ Preciso ser administrador do grupo.")
if(!q) return reply('*Escreva a mensagem de saída*')
if(isBemvindo2){
dataGp[0].wellcome[1].legendasaiu = q
setGp(dataGp)
reply('*Mensagem de saída definida com sucesso!*')
} else {
reply(`Ative o ${prefix}bemvindo2 1`)
}
break


case "menu":
case "m": {
try {
await reagir("❤️")
const imgMenu = "https://raw.githubusercontent.com/DeltaTempest-dev/uploads/main/2857jo.jpeg"

await base.sendMessage(from, {
image: { url: imgMenu },
caption: `╔•• 𝗕𝗘𝗠 𝗩𝗜𝗡𝗗𝗢(𝗔) 𝗔𝗢 𝗠𝗘𝗡𝗨 ••╗
  >.< ${pushname}
╚════════•••✦•••═══════╝
╭. ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.. ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.
│⋆˙⟡⋟👤 𝐔𝐬𝐮𝐚́𝐫𝐢𝐨: ${pushname}
│⋆˙⟡⋟📱 𝐍𝐮́𝐦𝐞𝐫𝐨: ${numero}
│⋆˙⟡⋟❤️ 𝐒𝐭𝐚𝐭𝐮𝐬: ${isGroup ? "Grupo" : "PV"}
│⋆˙⟡⋟📆 𝐃𝐚𝐭𝐚: ${data}
│⋆˙⟡⋟⏰ 𝐇𝐨𝐫𝐚: ${hora}
╰. ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.. ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.

┏━━━𖤐༺✦༻𖤐━━━┓
┃❤️ ➤ !menup
┃❤️ ➤ !menuadm
┃❤️ ➤ !menudown
┃❤️ ➤ !menudono
┗━━━𖤐༺✦༻𖤐━━━┛`
}, { quoted: info })

} catch (e) {
console.log(e)
reply("❌ Erro ao enviar o menu.")
}
}
break

case 'menuprincipal':
case 'menup': {
await reagir("📜")
await base.sendMessage(from, {
image: Slimemenus,
caption: linguagem.menu(prefix, sender, NomeBot, data, hora),
mentions: [sender]
}, { quoted: info })
}
break;

case 'menuadmin':
case 'menuadm': {
await reagir("⚜️")
await base.sendMessage(from, {
image: Slimemenus,
caption: linguagem.ADM(prefix),
mentions: [sender]
}, { quoted: info })
}
break;

case 'menudown':
case 'menudownload': {
await reagir("💿")
await base.sendMessage(from, {
image: Slimemenus,
caption: linguagem.Down(prefix),
mentions: [sender]
}, { quoted: info })
}
break;

case 'menudono': {
await reagir("👑")
await base.sendMessage(from, {
image: Slimemenus,
caption: linguagem.Dono(prefix),
mentions: [sender]
}, { quoted: info })
}
break;

case 'totalcmds':
case 'totalcmd': {
try {
const codigo = fs.readFileSync(__filename, 'utf8')
const total = (codigo.match(/case\s+['"`][^'"`]+['"`]\s*:\s*\{/g) || []).length
reply(`😎 Olá, ${pushname} >.<\n> 📊 Total de comandos: ${total}`)
} catch (e) {
console.log(e)
reply('❌ Erro ao contar os comandos.')
}
}
break


//comandos play

case 'play': {
try {

if (!q || !q.trim())
return reply(`💛 *${NomeBot}*\n\nDigite o nome da música!\n✨ Ex: *${prefix}play Drowning Kodak Black*`);

await reagir("🎧");

const yts = require("yt-search");
const search = await yts(q);

if (!search.videos.length)
return reply("❌ Música não encontrada.");

const video = search.videos[0];

const title = video.title;
const channel = video.author?.name || "Desconhecido";
const thumbnail = video.thumbnail;
const duration = video.timestamp || "N/A";
const query = video.url;

await base.sendMessage(from, {
image: { url: thumbnail },
caption:
`💛 *${NomeBot}*\n\n` +
`🎵 *${title}*\n` +
`💁‍♂️ Artista: ${channel}\n` +
`⏳ Duração: ${duration}`
}, { quoted: info });

let audioUrl =
`${Tokito_site}/api/youtube-audio?q=${encodeURIComponent(query)}&apikey=${API_KEY_TOKITO}`;

try {

await base.sendMessage(from, {
audio: { url: audioUrl },
mimetype: 'audio/mpeg',
ptt: false
}, { quoted: info });

} catch (err) {

audioUrl =
`${Tokito_site}/api/youtube-audio?q=${encodeURIComponent(title)}&apikey=${API_KEY_TOKITO}`;

await base.sendMessage(from, {
audio: { url: audioUrl },
mimetype: 'audio/mpeg',
ptt: false
}, { quoted: info });

}

await reagir("✅");

} catch (e) {
console.log("[PLAY ERRO]", e);
reply("❌🧊 *Encontrei um erro ao buscar a música.*");
}
break;
}

case 'play_video':
case 'playvideo':
case 'video': {
try {

if (!q || !q.trim())
return reply(`💛 *${NomeBot}*\n\nDigite o nome do vídeo!\n✨ Ex: *${prefix}video Naruto AMV*`);

await reagir("🎥");

const yts = require("yt-search");
const search = await yts(q);

if (!search.videos.length)
return reply("❌ Vídeo não encontrado.");

const video = search.videos[0];

const title = video.title;
const channel = video.author?.name || "Desconhecido";
const thumbnail = video.thumbnail;
const duration = video.timestamp || "N/A";
const query = video.url;

await base.sendMessage(from, {
image: { url: thumbnail },
caption:
`💛 *${NomeBot}*\n\n` +
`🎬 *${title}*\n` +
`💁‍♂️ Canal: ${channel}\n` +
`⏳ Duração: ${duration}`
}, { quoted: info });

let apiUrl =
`${Tokito_site}/api/youtube-video?q=${encodeURIComponent(query)}&apikey=${API_KEY_TOKITO}`;

try {

await base.sendMessage(from, {
video: { url: apiUrl },
mimetype: "video/mp4",
fileName: `${title}.mp4`
}, { quoted: info });

} catch (err) {

apiUrl =
`${Tokito_site}/api/youtube-video?q=${encodeURIComponent(title)}&apikey=${API_KEY_TOKITO}`;

await base.sendMessage(from, {
video: { url: apiUrl },
mimetype: "video/mp4",
fileName: `${title}.mp4`
}, { quoted: info });

}

await reagir("✅");

} catch (e) {
console.log("[VIDEO ERRO]", e);
reply("❌ Erro ao baixar vídeo.");
}
}
break;

case 'pdoc':
case 'playdoc': {
try {
if (!q || !q.trim())
return reply(`- Exemplo: ${prefix}playdoc nome da música`);
await reagir("📃");
const searchUrl =
`${Tokito_site}/api/youtube-search?query=${encodeURIComponent(q)}&apikey=${API_KEY_TOKITO}`;
const { data: json } = await axios.get(searchUrl);
if (!json.status || !json.resultado || !json.resultado.length)
return reply('❌ Nenhum resultado encontrado.');
const primeiro = json.resultado[0];
let title = primeiro.title || q;
title = title.replace(/[\\/:*?"<>|]/g, '').slice(0, 60);
await base.sendMessage(
from,
{
document: {
url: `${Tokito_site}/api/youtube-doc?q=${encodeURIComponent(primeiro.url || q)}&apikey=${API_KEY_TOKITO}`
},
mimetype: "audio/mpeg",
fileName: `${title}.mp3`
},
{ quoted: info }
);
} catch (e) {
console.log('playdoc error:', e);
}
}
break;

case 'spotify2':
case 'splink': {
try {
if (!q) return reply(`❌ | Envie um link do Spotify!`)

if (!q.includes("open.spotify.com")) {
return reply('❌ | Só aceita link do Spotify.')
}

await reagir('⌛')

let api = `https://tokito-apis.site/api/downloads/spotify-mp3?url=${encodeURIComponent(q)}&apikey=Euamoalaís`

let res = await fetch(api)

let type = res.headers.get("content-type") || ""

if (!type.includes("application/json")) {

let buffer = await res.arrayBuffer()

await base.sendMessage(from, {
audio: Buffer.from(buffer),
mimetype: 'audio/mpeg',
ptt: false
}, { quoted: info })

return await reagir('✅')
}

let data = await res.json()

if (!data || !data.status) {
return reply('❌ | Não foi possível baixar a música.')
}

let musica = data.resultado

let audio = await getBuffer(musica.download_url)

if (!audio) return reply('❌ | Áudio indisponível.')

await base.sendMessage(from, {
audio,
mimetype: 'audio/mpeg',
ptt: false
}, { quoted: info })

await reagir('✅')

} catch (e) {
console.log('[SPOTIFY ERROR]', e)
await reagir('❌')
reply('❌ | Erro ao processar música.')
}
}
break

case 'spotify':
case 'sp': {
try {
if (!q) return reply(`❌ | Digite o nome da música!\nEx: *${prefix + command} no batidão*`)

await reagir('⌛')

let api = `${Tokito_site}/api/spotify-play?query=${encodeURIComponent(q)}&apikey=${API_KEY_TOKITO}`
let data = await fetchJson(api)

if (!data || !data.status || !data.resultado) {
await reagir(from, '❌')
return reply('❌ | Música não encontrada.')
}

let musica = data.resultado

let card = `${Tokito_site}/canvas/spotify?title=${encodeURIComponent(musica.titulo)}&artist=${encodeURIComponent(musica.artista)}&duration=${encodeURIComponent(musica.duracao)}&thumbnail=${encodeURIComponent(musica.capa)}&popularity=${encodeURIComponent(musica.popularidade)}&album=${encodeURIComponent(musica.album)}&release_at=${encodeURIComponent(musica.release_at)}&url=${encodeURIComponent(musica.link)}&download_url=${encodeURIComponent(musica.download_url)}&apikey=${API_KEY_TOKITO}`

let caption = `🎧 *MÚSICA SPOTIFY*
━━━━━━━━━━━━━━━━━━━
- *🎞️ | ᴛɪ́ᴛᴜʟᴏ:* ${musica.titulo || 'Desconhecido'}
- *👤 | ᴀʀᴛɪꜱᴛᴀ:* ${musica.artista || 'Desconhecido'}
- *💽 | ᴀ́ʟʙᴜᴍ:* ${musica.album || 'Desconhecido'}
- *⏱️ | ᴅᴜʀᴀᴄ̧ᴀ̃ᴏ:* ${musica.duracao || '0:00'}
- *🔥 | ᴘᴏᴘᴜʟᴀʀɪᴅᴀᴅᴇ:* ${musica.popularidade || 0}
- *📅 | ʟᴀɴᴄ̧ᴀᴍᴇɴᴛᴏ:* ${musica.release_date || musica.release_at || 'Desconhecido'}
━━━━━━━━━━━━━━━━━━━
🔗 *Spotify:* ${musica.link || 'Indisponível'}`

await base.sendMessage(from, {
image: { url: card },
caption
}, { quoted: info })

if (musica.download_url) {
await base.sendMessage(from, {
audio: { url: musica.download_url },
mimetype: 'audio/mpeg',
ptt: false
}, { quoted: info })
}

await reagir('✅')

} catch (e) {
console.log('[SPOTIFY CASE ERRO]', e)
await reagir('❌')
reply('❌ | Erro ao buscar a música.')
}
}
break


case 'soundcloud':
case 'sc': {
try {
if (!q) return reply(`❌ | Digite o nome ou link da música!\nEx: *${prefix + command} mc ig*`)

await reagir("🎧")

let api = `${Tokito_site}/api/soundcloud?q=${encodeURIComponent(q)}&apikey=${API_KEY_TOKITO}`
let data = await fetchJson(api)

if (!data || !data.status || !data.resultado) {
await reagir("❌")
return reply("❌ | Música não encontrada.")
}

let musica = data.resultado

let canvas = `${Tokito_site}/canvas/soundcloud?title=${encodeURIComponent(musica.titulo || 'SoundCloud')}&artist=${encodeURIComponent(musica.autor || 'Desconhecido')}&duration=${encodeURIComponent(musica.duracao || '00:00')}&thumbnail=${encodeURIComponent(musica.imagem || '')}&album=${encodeURIComponent(musica.genero || 'SoundCloud')}&release_at=${encodeURIComponent(musica.publicado || 'Desconhecido')}&url=${encodeURIComponent(musica.url || '')}&audio=${encodeURIComponent(musica.audio || '')}&apikey=${API_KEY_TOKITO}`

let caption = `🎧 *MÚSICA SOUNDCLOUD*
━━━━━━━━━━━━━━━━━━━
- *🎞️ | ᴛɪ́ᴛᴜʟᴏ:* ${musica.titulo || "Desconhecido"}
- *👤 | ᴀʀᴛɪꜱᴛᴀ:* ${musica.autor || "Desconhecido"}
- *💽 | ꜰᴏʀᴍᴀᴛᴏ:* ${musica.ext || "mp3"}
- *🌐 | ꜱᴇʀᴠɪᴄ̧ᴏ:* SoundCloud
- *📥 | ᴛɪᴘᴏ:* Áudio MP3
━━━━━━━━━━━━━━━━━━━
🔗 *Link:* ${musica.url || "Indisponível"}`

await base.sendMessage(from, {
image: { url: canvas },
caption
}, { quoted: info })

await base.sendMessage(from, {
audio: { url: musica.audio },
mimetype: 'audio/mpeg',
fileName: `${musica.title || 'soundcloud'}.mp3`,
ptt: false
}, { quoted: info })

await reagir("✅")

} catch (e) {
console.log('[SOUNDCLOUD ERRO]', e)
await reagir("❌")
return reply("❌ | Música não encontrada.")
}
}
break

case 'sound_audio':
case 'soundcloudmp3':
case 'sc2':
case 'scmp3': {
try {
if (!q) return reply(`❌ | Digite o link do SoundCloud!\nEx: *${prefix + command} https://soundcloud.com/artista/musica*`)

await reagir("🎧")

const apiUrl = `${Tokito_site}/api/soundcloud-audio?url=${encodeURIComponent(q.trim())}&apikey=${API_KEY_TOKITO}`

await base.sendMessage(
from,
{
audio: { url: apiUrl },
mimetype: "audio/mpeg",
ptt: false
},
{ quoted: info }
)

await reagir("✅")

} catch (e) {
console.log('[SOUNDCLOUD MP3 ERRO]', e)
await reagir("❌")
return reply("❌ | Música não encontrada.")
}
}
break;

case 'tiktok':
case 'tt':
case 'ttdl': {
try {
if (!q)
return reply(`❌ | Utilize um link do tiktok.\n\n> ${prefix + command} link do TikTok`);

if (!/tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com/i.test(q))
return reply(`❌ Envie um link válido\n> Exemplo: ${prefix + command} link do TikTok`);

await reagir("🎥");

const apiUrl = `${Tokito_site}/api/tiktok-video?url=${encodeURIComponent(q.trim())}&apikey=${API_KEY_TOKITO}`;

await base.sendMessage(
from,
{
video: { url: apiUrl },
},
{ quoted: info }
);
await reagir("✅");
} catch (e) {
console.log('[TIKTOK ERRO]', e);
await reagir("❌");
return reply("❌ | Link inválido ou erro.");
}
}
break;

case 'tiktok_foto':
case 'ttkfoto':
case 'tiktok_all':
await reagir("⏳");
try {
if (!q) return reply(`${prefix + command} link do TikTok`);
const axios = require("axios");
const firstResp = await axios.get(
`${Tokito_site}/api/tiktok-foto?url=${q}&apikey=${API_KEY_TOKITO}&index=0`,
{ responseType: 'stream' }
);
const total = parseInt(firstResp.headers['x-total-fotos']) || 1;
await base.sendMessage(
from,
{
image: {
url: `${Tokito_site}/api/tiktok-foto?url=${q}&apikey=${API_KEY_TOKITO}&index=0`
}
},
{ quoted: info }
);
for (let i = 1; i < total; i++) {
await base.sendMessage(
from,
{
image: {
 url: `${Tokito_site}/api/tiktok-foto?url=${q}&apikey=${API_KEY_TOKITO}&index=${i}`
}
},
{ quoted: info }
);
}

} catch (e) {
console.log(e);
return reply("❌ | Link inválido ou erro.");
}
break;

default: {
      if (!isCmd) return;
      

      await reagir("❌");

      let CmdSimilar = ListaComandos(command) || { command: null, similarity: 0 };

      const sugestao = CmdSimilar.similarity > 40
        ? `${prefix}${CmdSimilar.command}`
        : "Nenhuma sugestão";

      const sem = `${(CmdSimilar.similarity || 0).toFixed(1)}%`;

      await base.sendMessage(from, {
        text:
` ❌ Comando não encontrado\n\nPrefixo: ${prefix}\nHora: ${hora}\nData: ${data}\n\n🚫 Comando: ${prefix + command}\n💡 Sugestão: ${sugestao}\n📊 Similaridade: ${sem}\n\n${NomeBot} não reconheceu esse comando.\n\n> Utilize o comando ${prefix}menu para ver todos os comandos disponíveis.`
      }, { quoted: info });

      break;
    }

  }

} catch (err) {
  console.log("❌ Erro geral:", err);
}
}