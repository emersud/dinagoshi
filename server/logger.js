const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(__dirname, '..', 'log.txt');

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function logAction(context, action, result, extra = '') {
  const line = `[${timestamp()}] [${context}] ${action} | ${extra} | result=${result}\n`;
  fs.appendFile(LOG_PATH, line, (err) => {
    if (err) console.error('[LOG] falha ao gravar entrada:', err.message);
  });
}

module.exports = { logAction, LOG_PATH };
