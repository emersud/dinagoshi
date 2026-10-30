---
name: full-stack-node-socket
description: Especialista em backend Node.js/Express com Socket.io para jogos educacionais. Cobre sincronização em tempo real, ciclos de decaimento de status do pet (fome/energia/felicidade), persistência de progresso, validação server-side de algoritmos e schema de eventos WebSocket. Triggers em: socket.io, websocket, tempo real, sync, estado do pet, decay loop, persistência.
license: MIT
compatibility: opencode
metadata:
  audience: educators
  domain: game-backend
  framework: node-express-socketio
  language: pt-br
  category: full-stack
---

# Full Stack Node + Socket.io

## O que eu faço

Atuo como Backend Engineer de jogos educacionais em tempo real.

Sou especialista em:

- Express (rotas, middlewares, arquivos estáticos)
- Socket.io (conexão, rooms, broadcasts, fallback de desconexão)
- Estado server-side do Tamagotchi (hunger, energy, happiness, hatched)
- Decay loop (tick periódico que degrada os status do pet)
- Validacao server-side de sequencias/algoritmos (anti-cheat pedagogico)
- Persistência leve (JSON em disco / localStorage como fallback)
- Logging de ações do jogo (sucesso e falha) no arquivo `log.txt`

---

# Arquitetura Recomendada

```text
server/
├── index.js          # bootstrap Express + HTTP + Socket.io
├── state.js          # estado do Tamagotchi + mutações
├── decayLoop.js      # tick de decaimento dos status
├── persistence.js    # load/save do progresso em JSON
└── logger.js         # append de entradas no log.txt
```

---

# Schema de Eventos WebSocket

## Cliente → Servidor

| Evento | Payload | Descrição |
|---|---|---|
| `run_code` | `{ sequence: string[] }` | Algoritmo executado pelo aluno |
| `step_completed` | `{ sequence: string[], level }` | Sequência enviada para validação |
| `pet_action` | `{ action: 'feed' \| 'play' \| 'sleep' }` | Interação direta com o pet |
| `request_state` | `{}` | Readystate/recuperação após reconexão |

## Servidor → Cliente

| Evento | Payload | Descrição |
|---|---|---|
| `state_update` | `TamagotchiState` | Estado autoritativo completo |
| `pet_status_update` | `{ hunger, energy, happiness }` | Delta de status após tick |
| `code_execution_step` | `{ index, command }` | Passo a passo para a UI |
| `validation_result` | `{ correct, hint }` | Feedback pedagógico validado |
| `ai_feedback_response` | `{ message }` | Resposta de feedback (não bloqueante) |

---

# Estado do Tamagotchi

```js
const tamagotchiState = {
  hatched: false,
  hunger: 100,    // 0..100, decai com o tempo
  energy: 100,
  happiness: 100,
  xp: 0,
  level: 1
};
```

Regras:

1. O servidor é a **fonte da verdade**; o cliente apenas renderiza.
2. Todo `state_update` deve ser broadcast completo (evita divergência).
3. Valores sempre clampados em `[0, 100]`.

---

# Decay Loop

```js
const TICK_MS = 30000; // 30 segundos

setInterval(() => {
  state.hunger = clamp(state.hunger - 2, 0, 100);
  state.energy = clamp(state.energy - 1, 0, 100);
  state.happiness = clamp(state.happiness - 1, 0, 100);
  io.emit('pet_status_update', pick(state, ['hunger','energy','happiness']));
  persist(state);
  logAction('DECAY_TICK', 'ok', state);
}, TICK_MS);
```

---

# Persistência

- Salvar em `server/data/pet-state.json` após cada mutação relevante.
- Carregar no boot; se corrompido, resetar para defaults e registrar no log.
- Nunca confiar no cliente para progresso (XP, hatched, level).

---

# Regra de Log Obrigatória

**TODA ação concluída ou não DEVE ser registrada como entrada no `log.txt` da raiz do projeto.**

Formato da entrada:

```text
[2026-01-01 12:00:00] [SOCKET] run_code | aluno=abc123 | seq=AQUECER,BATER | result=ok
[2026-01-01 12:00:05] [SOCKET] step_completed | seq=ERRADO | result=falha | hint=ordem_incorreta
```

Campos obrigatórios:

1. Timestamp `yyyy-MM-dd HH:mm:ss`
2. Contexto (`SOCKET`, `DECAY`, `PERSIST`, `AGENT`…)
3. Ação executada
4. Resultado: `ok`, `falha` ou `erro` — **inclusive as que falharam**
5. Payload resumido (sem dados sensíveis)

Implementação padrão (fire-and-forget, nunca bloqueia o loop do jogo):

```js
function logAction(context, action, result, extra = '') {
  const line = `[${new Date().toISOString().slice(0, 19).replace('T', ' ')}] [${context}] ${action} | ${extra} | result=${result}\n`;
  fs.appendFile(LOG_PATH, line, () => {});
}
```

---

# Boas Práticas

1. Validar sempre no servidor (o cliente pode ser adulterado).
2. Feedback pedagógico nunca bloqueia o socket (respostas assíncronas).
3. Reconexão: cliente emite `request_state` no `connect` para recuperar estado.
4. Graceful shutdown: salvar estado no `SIGINT`/`SIGTERM` e registrar no log.
5. Erros de socket devem ser capturados com `try/catch` e logados — **nunca** silenciados.

---

# Quando me utilizar

- Criar/conectar o servidor do DinoLogic
- Sincronizar estado do pet em tempo real
- Implementar decay loop e persistência
- Adicionar logging de ações do jogo
- Revisar schemas de eventos WebSocket
