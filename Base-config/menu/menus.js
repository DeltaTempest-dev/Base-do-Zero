exports.menu = (prefix, sender, NomeBot, data, hora ) => {
const readMore = String.fromCharCode(8206).repeat(4001);

return `
┏°»｡ ∾･⁙･ ❤️ ➵ ⁘ ➵ ❤️ ･⁙･∾ ｡«°┓
 ❤️ 𝐁𝐄𝐌 𝐕𝐈𝐍𝐃𝐎(𝐀) 𝐀𝐎 𝐌𝐄𝐍𝐔❤️
┗°»｡ ∾･⁙･ ❤️ ➵ ⁘ ➵ ❤️ ･⁙･∾ ｡«°┛
┆💛𝐔𝐬𝐮𝐚́𝐫𝐢𝐨: @${sender?.split("@")[0]}
┆💁‍♂️𝐁𝐨𝐭: ${NomeBot}
┆📆𝐃𝐚𝐭𝐚: ${data}
┆⏰𝐇𝐨𝐫𝐚: ${hora}  
┗°»｡ ∾･⁙･ ❤️ ➵ ⁘ ➵ ❤️ ･⁙･∾ ｡«°┛
${readMore}

┏°»｡ ∾･⁙･ ❤️ ➵ ⁘ ➵ ❤️ ･⁙･∾ ｡«°┓
┃🚫 𝑴𝑬𝑵𝑼 𝑷𝑹𝑰𝑵𝑪𝑰𝑷𝑨𝑳 🚫╠╾⧽͟𖠁͞⪼ 🩸
┗°»｡ ∾･⁙･ ❤️ ➵ ⁘ ➵ ❤️ ･⁙･∾ ｡«°┛

┏━━━𖤐༺✦༻𖤐━━━┓
┃❤️ ➤ ${prefix}menup
┃❤️ ➤ ${prefix}menuadm
┃❤️ ➤ ${prefix}menudown
┃❤️ ➤ ${prefix}menudono
┗━━━𖤐༺✦༻𖤐━━━┛`;
};


exports.Dono = (prefix ) => {
const readMore = String.fromCharCode(8206).repeat(4001);

return `┏°»｡ ∾･⁙･ ❤️ ➵ ⁘ ➵ ❤️ ･⁙･∾ ｡«°┓
┃🚫 𝑴𝑬𝑵𝑼 𝑫𝑶𝑵𝑶 🚫╠╾⧽͟𖠁͞⪼ 🩸
┗°»｡ ∾･⁙･ ❤️ ➵ ⁘ ➵ ❤️ ･⁙･∾ ｡«°┛
${readMore}
┏━━━𖤐༺✦༻𖤐━━━┓
┃❤️ ➤ ${prefix}reiniciar
┗━━━𖤐༺✦༻𖤐━━━┛`;
};

exports.ADM = (prefix ) => {
const readMore = String.fromCharCode(8206).repeat(4001);

return `┏°»｡ ∾･⁙･ ❤️ ➵ ⁘ ➵ ❤️ ･⁙･∾ ｡«°┓
┃🚫 𝑴𝑬𝑵𝑼 𝑨𝑫𝑴 🚫╠╾⧽͟𖠁͞⪼ 🩸
┗°»｡ ∾･⁙･ ❤️ ➵ ⁘ ➵ ❤️ ･⁙･∾ ｡«°┛
${readMore}

┏━━━𖤐༺✦༻𖤐━━━┓
┃❤️ ➤ ${prefix}ban
┃❤️ ➤ ${prefix}bemvindo
┃❤️ ➤ ${prefix}bemvindo2
┃❤️ ➤ ${prefix}legendabv
┃❤️ ➤ ${prefix}legendabv2
┃❤️ ➤ ${prefix}legendasaiu
┃❤️ ➤ ${prefix}legendasaiu2
┗━━━𖤐༺✦༻𖤐━━━┛`;
};


exports.Down = (prefix ) => {
const readMore = String.fromCharCode(8206).repeat(4001);

return `┏°»｡ ∾･⁙･ ❤️ ➵ ⁘ ➵ ❤️ ･⁙･∾ ｡«°┓
┃🚫 𝑴𝑬𝑵𝑼 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫'𝑺 🚫╠╾⧽͟𖠁͞⪼ 🩸
┗°»｡ ∾･⁙･ ❤️ ➵ ⁘ ➵ ❤️ ･⁙･∾ ｡«°┛
${readMore}

┏━━━𖤐༺✦༻𖤐━━━┓
┃❤️ ➤ ${prefix}play
┃❤️ ➤ ${prefix}video
┃❤️ ➤ ${prefix}pdoc
┃❤️ ➤ ${prefix}spotify2
┃❤️ ➤ ${prefix}spotify
┃❤️ ➤ ${prefix}soundcloud
┃❤️ ➤ ${prefix}sound_audio
┃❤️ ➤ ${prefix}tiktok
┃❤️ ➤ ${prefix}tiktok_foto
┗━━━𖤐༺✦༻𖤐━━━┛`;
};