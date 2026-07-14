const fs = require("fs");

const axios = require('axios');

const moment = require("moment-timezone");

const { downloadContentFromMessage, downloadMediaMessage, prepareWAMessageMedia,jidNormalizedUser, getContentType } = require("@whiskeysockets/baileys");

const setting = JSON.parse(fs.readFileSync("./Base-config/dono.json"));

// ===================== GET BUFFER =====================
const getBuffer = async (url, options = {}) => {
  try {
    const res = await axios({
      method: "get",
      url,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        DNT: 1,
        "Upgrade-Insecure-Request": 1
      },
      responseType: "arraybuffer",
      ...options
    });

    return res.data;

  } catch (err) {
    console.log("Erro getBuffer:", err.message);
    return null;
  }
};

// ===================== FETCH JSON =====================
async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    return await res.json();
  } catch (err) {
    console.log("Erro fetchJson:", err.message);
    return null;
  }
};
const { linguagem, mess } = require('./menu/index')

module.exports = {
fs,
axios,
moment,
linguagem,
mess,
getBuffer,
fetchJson,
downloadContentFromMessage,
downloadMediaMessage, 
prepareWAMessageMedia,
jidNormalizedUser,
getContentType,
setting
};