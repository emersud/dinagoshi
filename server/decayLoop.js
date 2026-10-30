const { logAction } = require('./logger');
const stateMod = require('./state');
const persistence = require('./persistence');

const TICK_MS = 30000;
let timer = null;
let ioRef = null;

function tick() {
  try {
    const status = stateMod.applyDecay();
    if (ioRef) ioRef.emit('pet_status_update', status);
    persistence.save(stateMod.serialize());
    logAction('DECAY', 'tick', 'ok', `hunger=${status.hunger} energy=${status.energy} happiness=${status.happiness}`);
  } catch (err) {
    logAction('DECAY', 'tick', 'erro', err.message);
  }
}

function start(io) {
  if (timer) return;
  ioRef = io;
  timer = setInterval(tick, TICK_MS);
  timer.unref && timer.unref();
  logAction('DECAY', 'start', 'ok', `tick_ms=${TICK_MS}`);
}

function stop() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
  logAction('DECAY', 'stop', 'ok', '');
}

module.exports = { start, stop, TICK_MS };
