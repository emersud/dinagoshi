// tools/smoke_test.js — valida o fluxo completo: conexao -> sequencia errada -> sequencia correta -> pet_action
const path = require('path');

let io;
try {
  const clientPath = path.join(__dirname, '..', 'node_modules', 'socket.io', 'client-dist', 'socket.io.js');
  const client = require(clientPath);
  io = client.io || client;
  if (typeof io !== 'function' && client.default) io = client.default;
} catch (e) {
  console.error('ERRO: cliente socket.io nao encontrado:', e.message);
  process.exit(2);
}

const URL = process.env.DINO_URL || 'http://localhost:3000';
const CORRECT = ['AQUECER', 'BATER', 'ESPERAR'];
const WRONG = ['BATER', 'AQUECER'];

const results = [];
const socket = io(URL, { transports: ['websocket'] });

function check(name, cond) {
  results.push({ name, ok: !!cond });
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
}

function once(event, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout aguardando '${event}'`)), timeoutMs);
    socket.once(event, (data) => {
      clearTimeout(t);
      resolve(data);
    });
  });
}

async function main() {
  const state1 = await once('state_update');
  check('state_update inicial recebido', typeof state1.hunger === 'number');

  socket.emit('step_completed', { sequence: WRONG });
  const bad = await once('validation_result');
  check('sequencia errada validada como incorrect', bad.correct === false);
  check('dica pedagogica enviada na falha', typeof bad.hint === 'string' && bad.hint.length > 0);

  socket.emit('step_completed', { sequence: CORRECT });
  const good = await once('validation_result');
  check('sequencia correta aceita', good.correct === true);
  check('XP concedido (>= 20)', good.xp >= 20);

  const state2 = await once('state_update');
  check('pet marcado como chocado (hatched)', state2.hatched === true);

  const hungerBefore = state2.hunger;
  socket.emit('pet_action', { action: 'feed' });
  const state3 = await once('state_update');
  check('pet_action feed aumenta fome', state3.hunger >= hungerBefore);

  socket.emit('pet_action', { action: 'invalido' });
  const invalid = await once('validation_result');
  check('pet_action invalido rejeitado', invalid.correct === false);

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} verificacoes passaram`);
  socket.close();
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('ERRO no smoke test:', err.message);
  socket.close();
  process.exit(1);
});
