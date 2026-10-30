const fs = require('fs');
const path = require('path');
const { logAction } = require('./logger');

const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'pet-state.json');

function load() {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      logAction('PERSIST', 'load', 'ok', 'arquivo inexistente, usando estado padrao');
      return null;
    }
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    logAction('PERSIST', 'load', 'ok', `xp=${parsed.xp} hatched=${parsed.hatched}`);
    return parsed;
  } catch (err) {
    logAction('PERSIST', 'load', 'erro', err.message);
    return null;
  }
}

function save(serialized) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(STATE_FILE, serialized, 'utf8');
    logAction('PERSIST', 'save', 'ok', `tamanho=${serialized.length}b`);
    return true;
  } catch (err) {
    logAction('PERSIST', 'save', 'erro', err.message);
    return false;
  }
}

module.exports = { load, save, STATE_FILE };
