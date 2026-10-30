import { GAME_WIDTH, GAME_HEIGHT, COMMAND_LABELS, EXPECTED_SEQUENCE } from './game/config.js';
import { BootScene } from './game/scenes/BootScene.js';
import { PreloadScene } from './game/scenes/PreloadScene.js';
import { HatchScene } from './game/scenes/HatchScene.js';
import { SequenceRunner } from './interpreter/sequenceRunner.js';

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#2d572c',
  scene: [BootScene, PreloadScene, HatchScene]
};

const game = new Phaser.Game(config);
const socket = io();

let programQueue = [];
let runner = null;

function getRunner() {
  if (!runner) {
    runner = new SequenceRunner(game.scene.getScene('HatchScene'));
  }
  return runner;
}

function renderQueue() {
  const ol = document.getElementById('program-queue');
  ol.innerHTML = programQueue
    .map((c, i) => `<li onclick="removeCommand(${i})" title="Clique para remover">${i + 1}. ${COMMAND_LABELS[c] || c}</li>`)
    .join('');
}

function setBubble(message) {
  const bubble = document.getElementById('bubble');
  if (bubble) bubble.innerText = message;
}

function updateHud(state) {
  const setBar = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.style.width = `${Math.max(0, Math.min(100, v))}%`;
  };
  setBar('bar-hunger', state.hunger);
  setBar('bar-energy', state.energy);
  setBar('bar-happiness', state.happiness);
  const xp = document.getElementById('xp');
  const level = document.getElementById('level');
  if (xp) xp.innerText = state.xp ?? 0;
  if (level) level.innerText = state.level ?? 1;
  if (state.hatched) setBubble('🦖 Olá! Seu dinossauro nasceu. Cuide dele programando!');
}

window.addCommand = function (cmd) {
  if (programQueue.length >= 8) {
    setBubble('🧩 Fila cheia (máx. 8)! Remova um comando antes de adicionar outro.');
    return;
  }
  programQueue.push(cmd);
  renderQueue();
};

window.removeCommand = function (index) {
  programQueue.splice(index, 1);
  renderQueue();
};

window.clearProgram = function () {
  programQueue = [];
  renderQueue();
  const feedback = document.getElementById('feedback-panel');
  if (feedback) feedback.innerText = '';
  setBubble('');
};

window.executeAlgorithm = async function () {
  const runBtn = document.getElementById('run-btn');
  const r = getRunner();
  if (r.running) return;

  runBtn.disabled = true;
  const attemptsBefore = r.attempts;
  const result = await r.run(programQueue);
  runBtn.disabled = false;

  const attemptEl = document.getElementById('attempt-count');
  if (attemptEl) attemptEl.innerText = r.attempts;

  if (result && result.skipped) return;

  socket.emit('step_completed', {
    sequence: programQueue,
    attempts: r.attempts,
    correct: !!result.correct
  });

  if (result && result.empty) {
    socket.emit('run_code', { sequence: [], outcome: 'empty' });
  } else if (r.attempts > attemptsBefore && !result.correct) {
    socket.emit('run_code', { sequence: programQueue, outcome: 'failed' });
  }
};

window.petAction = function (action) {
  socket.emit('pet_action', { action });
};

socket.on('connect', () => {
  socket.emit('request_state');
});

socket.on('state_update', (state) => {
  updateHud(state);
});

socket.on('pet_status_update', (status) => {
  const current = {
    hunger: status.hunger,
    energy: status.energy,
    happiness: status.happiness
  };
  updateHud(current);
  if (status.hunger <= 20) setBubble('🍽️ Estou com fome... Programe uma pausa e me alimente!');
});

socket.on('validation_result', (res) => {
  if (res.correct) {
    socket.emit('request_state');
  } else if (res.hint) {
    const feedback = document.getElementById('feedback-panel');
    if (feedback && !feedback.innerText) feedback.innerText = res.hint;
  }
  const xp = document.getElementById('xp');
  const level = document.getElementById('level');
  if (xp && typeof res.xp === 'number') xp.innerText = res.xp;
  if (level && typeof res.level === 'number') level.innerText = res.level;
});

socket.on('disconnect', () => {
  setBubble('🔌 Conexão perdida. Tentando reconectar...');
});

window.addEventListener('beforeunload', () => {
  game.destroy(true);
});

export { EXPECTED_SEQUENCE };
