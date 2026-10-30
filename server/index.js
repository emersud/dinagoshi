const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const { logAction } = require('./logger');
const stateMod = require('./state');
const persistence = require('./persistence');
const decayLoop = require('./decayLoop');

const EXPECTED_SEQUENCE = ['AQUECER', 'BATER', 'ESPERAR'];

const HINTS = [
  '💡 Dica: comece aquecendo o ovo (AQUECER), depois bata de leve (BATER) e espere (ESPERAR).',
  '🧩 Analogia: é uma receita — primeiro o forno esquenta, depois a massa bate, depois descansa.',
  '🔍 Depuração: sua fila deve ser exatamente AQUECER, BATER, ESPERAR. Remova comandos extras.',
  '✅ Prática guiada: monte 1º AQUECER, 2º BATER, 3º ESPERAR e execute novamente.'
];

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/src', express.static(path.join(__dirname, '..', 'src')));
app.use('/vendor', express.static(path.join(__dirname, '..', 'node_modules', 'phaser', 'dist')));

const saved = persistence.load();
if (saved) stateMod.hydrate(saved);

io.on('connection', (socket) => {
  logAction('SOCKET', 'connect', 'ok', `aluno=${socket.id}`);
  socket.emit('state_update', stateMod.getState());

  socket.on('request_state', () => {
    socket.emit('state_update', stateMod.getState());
  });

  socket.on('run_code', (data) => {
    const seq = Array.isArray(data && data.sequence) ? data.sequence.join(',') : 'invalido';
    logAction('SOCKET', 'run_code', 'ok', `outcome=${(data && data.outcome) || 'n/a'} seq=${seq}`);
  });

  socket.on('step_completed', (data) => {
    try {
      const seq = Array.isArray(data && data.sequence) ? data.sequence : [];
      const correct = JSON.stringify(seq) === JSON.stringify(EXPECTED_SEQUENCE);
      const result = stateMod.recordAttempt(correct);

      logAction(
        'SOCKET',
        'step_completed',
        correct ? 'ok' : 'falha',
        `seq=${seq.join(',') || 'vazio'} tentativa=${result.attempts} xp=${result.xp}`
      );

      const hint = correct
        ? null
        : HINTS[Math.min(result.attempts - 1, HINTS.length - 1)];

      socket.emit('validation_result', {
        correct,
        attempts: result.attempts,
        xp: result.xp,
        level: result.level,
        hint
      });

      if (correct) persistence.save(stateMod.serialize());
      io.emit('state_update', stateMod.getState());
    } catch (err) {
      logAction('SOCKET', 'step_completed', 'erro', err.message);
      socket.emit('validation_result', { correct: false, error: 'Erro interno ao validar.' });
    }
  });

  socket.on('pet_action', (data) => {
    try {
      const action = data && data.action;
      const next = stateMod.applyPetAction(action);
      if (!next) {
        logAction('SOCKET', 'pet_action', 'falha', `acao_invalida=${action}`);
        socket.emit('validation_result', { correct: false, hint: 'Ação inválida.' });
        return;
      }
      persistence.save(stateMod.serialize());
      io.emit('state_update', next);
    } catch (err) {
      logAction('SOCKET', 'pet_action', 'erro', err.message);
    }
  });

  socket.on('disconnect', () => {
    logAction('SOCKET', 'disconnect', 'ok', `aluno=${socket.id}`);
  });

  socket.on('error', (err) => {
    logAction('SOCKET', 'error', 'erro', err.message);
  });
});

decayLoop.start(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor DinoLogic rodando na porta ${PORT}`);
  logAction('SOCKET', 'server_start', 'ok', `port=${PORT}`);
});

function shutdown(signal) {
  logAction('SOCKET', 'shutdown', 'ok', `signal=${signal}`);
  decayLoop.stop();
  persistence.save(stateMod.serialize());
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (err) => {
  logAction('SOCKET', 'uncaughtException', 'erro', err.stack || err.message);
});
