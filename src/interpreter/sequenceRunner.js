import { EXPECTED_SEQUENCE, COMMAND_ACTIONS, WAIT_MS } from '../game/config.js';

const CONTEXTS = [
  {
    title: '💡 Dica: ordem dos passos',
    text: 'Contextualização: um algoritmo é uma receita — a ordem dos ingredientes importa. Tente: Aquecer → Bater → Esperar.'
  },
  {
    title: '🧩 Analogia: receita de bolo',
    text: 'Analogia: se você bate o bolo antes de aquecer o forno, ele não cresce! Aqueça o ovo primeiro, depois bata com cuidado e espere a casca ceder.'
  },
  {
    title: '🧩 Prática guiada: monte passo a passo',
    text: 'Prática guiada: 1º 🔥 AQUECER, 2º 🔨 BATER, 3º ⏳ ESPERAR. Clique na ordem exata e execute.'
  },
  {
    title: '🔍 Depuração: confira a fila',
    text: 'Depuração: veja a Fila de Algoritmo. Está igual a: AQUECER, BATER, ESPERAR? Remova comandos extras clicando neles.'
  }
];

export class SequenceRunner {
  constructor(scene) {
    this.scene = scene;
    this.expectedSequence = EXPECTED_SEQUENCE;
    this.running = false;
    this.attempts = 0;
  }

  isCorrect(userCommands) {
    return (
      userCommands.length === this.expectedSequence.length &&
      userCommands.every((cmd, i) => cmd === this.expectedSequence[i])
    );
  }

  async execute(userCommands) {
    for (const cmd of userCommands) {
      const action = COMMAND_ACTIONS[cmd];
      if (action === 'wait') {
        await this.scene.wait(WAIT_MS);
      } else if (action) {
        await this.scene[action]();
      }
    }
  }

  async run(userCommands) {
    if (this.running) return { skipped: true };
    this.running = true;

    const feedback = document.getElementById('feedback-panel');
    const bubble = document.getElementById('bubble');
    setFeedback('🤖 Executando algoritmo...', feedback, bubble);

    if (userCommands.length === 0) {
      setFeedback('🧩 A fila está vazia. Adicione comandos antes de executar!', feedback, bubble);
      this.running = false;
      return { empty: true };
    }

    await this.execute(userCommands);

    const correct = this.isCorrect(userCommands);

    if (correct) {
      this.attempts += 1;
      await this.scene.playHatch();
      setFeedback(
        '🎉 PARABÉNS! Você programou a sequência perfeita e o Dinossauro nasceu! — Reflexão: o que aconteceria se trocássemos BATER e ESPERAR?',
        feedback,
        bubble
      );
    } else {
      this.attempts += 1;
      const ctx = CONTEXTS[Math.min(this.attempts - 1, CONTEXTS.length - 1)];
      setFeedback(`${ctx.title} — ${ctx.text}`, feedback, bubble);
      this.scene.resetEgg();
    }

    this.running = false;
    return { correct, attempts: this.attempts };
  }

  resetAttempts() {
    this.attempts = 0;
  }
}

function setFeedback(message, feedback, bubble) {
  if (feedback) feedback.innerText = message;
  if (bubble) bubble.innerText = message.split('—')[0].trim();
}
