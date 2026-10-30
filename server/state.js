const { logAction } = require('./logger');

const DEFAULT_STATE = {
  hatched: false,
  hunger: 100,
  energy: 100,
  happiness: 100,
  xp: 0,
  level: 1,
  attempts: 0
};

let state = { ...DEFAULT_STATE };

const clamp = (v) => Math.max(0, Math.min(100, v));

const PET_ACTIONS = {
  feed: { hunger: 15, happiness: 2, energy: 0 },
  play: { happiness: 15, energy: -5, hunger: -3 },
  sleep: { energy: 20, happiness: 2, hunger: -2 }
};

function getState() {
  return { ...state };
}

function applyDecay() {
  state.hunger = clamp(state.hunger - 2);
  state.energy = clamp(state.energy - 1);
  state.happiness = clamp(state.happiness - 1);
  return { hunger: state.hunger, energy: state.energy, happiness: state.happiness };
}

function applyPetAction(action) {
  const delta = PET_ACTIONS[action];
  if (!delta) return null;
  state.hunger = clamp(state.hunger + (delta.hunger || 0));
  state.energy = clamp(state.energy + (delta.energy || 0));
  state.happiness = clamp(state.happiness + (delta.happiness || 0));
  logAction('SOCKET', `pet_action:${action}`, 'ok', `hunger=${state.hunger} energy=${state.energy} happiness=${state.happiness}`);
  return getState();
}

function recordAttempt(correct) {
  state.attempts += 1;
  if (correct) {
    const wasHatched = state.hatched;
    state.hatched = true;
    if (!wasHatched) state.xp += 20;
    else state.xp += 5;
    state.level = Math.floor(state.xp / 50) + 1;
    state.happiness = clamp(state.happiness + 10);
  }
  return { correct, attempts: state.attempts, xp: state.xp, level: state.level, wasHatched: state.hatched };
}

function hydrate(raw) {
  if (!raw || typeof raw !== 'object') return false;
  const num = (v, fallback) => (typeof v === 'number' && isFinite(v) ? v : fallback);
  state = {
    hatched: !!raw.hatched,
    hunger: clamp(num(raw.hunger, DEFAULT_STATE.hunger)),
    energy: clamp(num(raw.energy, DEFAULT_STATE.energy)),
    happiness: clamp(num(raw.happiness, DEFAULT_STATE.happiness)),
    xp: Math.max(0, num(raw.xp, 0)),
    level: Math.max(1, num(raw.level, 1)),
    attempts: Math.max(0, num(raw.attempts, 0))
  };
  return true;
}

function serialize() {
  return JSON.stringify(state, null, 2);
}

module.exports = { getState, applyDecay, applyPetAction, recordAttempt, hydrate, serialize, DEFAULT_STATE };
