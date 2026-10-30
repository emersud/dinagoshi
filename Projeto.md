Aqui está a especificação completa em formato **Markdown** estruturada para você copiar e salvar diretamente como o prompt/instrução principal do seu projeto no OpenCode. Ela inclui as definições das **Skills nativas**, permissões em `opencode.json`, arquitetura do projeto e o código da build inicial funcional baseada no spritesheet de eclosão do dinossauro.

# 🤖 System Prompt / Spec de Inicialização para OpenCode

Markdown

````
# OpenCode System Prompt: Tamagotchi Pedagógico (DinoLogic Engine)

Atue como um **Desenvolvedor Full Stack Sênior, Game Designer e Pedagogo Tech**. Sua missão é criar a estrutura inicial e o primeiro build funcional do projeto **DinoLogic**, um jogo de Tamagotchi em Pixel Art focado no ensino de lógica de programação por sequenciamento.

---

## 🛠️ 1. Mapeamento do Ecossistema Completo de Skills (.opencode/skills)

As seguintes habilidades já estão estruturadas em suas respectivas pastas dentro de `.opencode/skills/<name>/SKILL.md` e serão invocadas sob demanda pelo agente:

1. **`animation`**: Gerenciamento de spritesheets, sequências de frames e playback de animações no Phaser 3.
2. **`educational-pedagogy`**: Estruturação de desafios baseados na Teoria do Construcionismo e mapas de feedback pedagógico.
3. **`full-stack-node-socket`**: Comunicação bidirecional via Socket.io, persistência de dados do Tamagotchi e loop de decremento dos status no Node.js.
4. **`game-architecture`**: Organização de cenas (BootScene, HatchScene, MainScene), gerenciadores de estado e ciclos de vida do jogo.
5. **`game-setup-and-config`**: Parâmetros de inicialização do Canvas no Phaser (resolução, parent div, suporte a retina/mobile).
6. **`physics-arcade`**: Colisões, gravidade e limites de mundo para interações físicas do dinossauro (ex: pegar fruta, brincar com bola).
7. **`pixel-art-prompting`**: Diretrizes e engenharia de prompt para geração de spritesheets em Pixel Art alinhados em grid.
8. **`render-textures`**: Manipulação e renderização avançada de imagens sem borrões (`pixelArt: true`, `roundPixels: true`).
9. **`sprites-and-images`**: Carregamento, escalonamento, âncoras (origins) e manipulação gráfica de objetos estáticos e dinâmicos no Canvas.

---

## 🔒 1.1. Configuração do `opencode.json` (Permissões de Skills)

Atualize o arquivo `opencode.json` na raiz do projeto para garantir o acesso direto a todas as 9 skills:

```json
{
  "permission": {
    "skill": {
      "animation": "allow",
      "educational-pedagogy": "allow",
      "full-stack-node-socket": "allow",
      "game-architecture": "allow",
      "game-setup-and-config": "allow",
      "physics-arcade": "allow",
      "pixel-art-prompting": "allow",
      "render-textures": "allow",
      "sprites-and-images": "allow",
      "*": "allow"
    }
  }
}

```

## 📐 2. Arquitetura da Infraestrutura do Projeto

Configure o repositório com a seguinte estrutura de arquivos:

Plaintext

```
dinologic/
├── .opencode/
│   └── skills/
│       ├── animation/SKILL.md
│       ├── educational-pedagogy/SKILL.md
│       ├── full-stack-node-socket/SKILL.md
│       ├── game-architecture/SKILL.md
│       ├── game-setup-and-config/SKILL.md
│       ├── physics-arcade/SKILL.md
│       ├── pixel-art-prompting/SKILL.md
│       ├── render-textures/SKILL.md
│       └── sprites-and-images/SKILL.md
├── opencode.json
├── public/
│   ├── assets/
│   │   └── dino_hatch_sheet.png
│   ├── index.html
│   └── style.css
├── src/
│   ├── game/
│   │   ├── scenes/
│   │   │   ├── BootScene.js
│   │   │   └── HatchScene.js
│   │   └── config.js
│   ├── interpreter/
│   │   └── sequenceRunner.js
│   └── main.js
├── server/
│   └── index.js
└── package.json

```

## 🚀 3. Build Inicial Funcional: Fase de Sequenciamento "Sair do Ovo"

O objetivo do build inicial é entregar uma interface web funcional onde o aluno programa uma sequência simples para fazer o dinossauro chocar do ovo.

### 🖼️ Mapeamento do Spritesheet do Anexo (`dino_hatch_sheet.png`)

Utilize a imagem fornecida (2 linhas x 4 colunas = 8 quadros totais):   

- **Linha 1 (Frames 0 a 3):** Ovo intacto, tremores sutis e primeiras rachaduras.   

- **Linha 2 (Frames 4 a 7):** Rachadura aberta, dinossauro emergindo e olhando para os lados.   




### 💻 Códigos do Build Inicial

#### `package.json`

JSON

```
{
  "name": "dinologic",
  "version": "1.0.0",
  "description": "Tamagotchi Pedagógico de Lógica de Programação",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "phaser": "^3.80.1",
    "socket.io": "^4.7.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}

```

#### `public/index.html`

HTML

```
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DinoLogic - Tamagotchi Pedagógico</title>
  <link rel="stylesheet" href="style.css">
  <script src="[https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js](https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js)"></script>
  <script src="/socket.io/socket.io.js"></script>
</head>
<body>
  <div id="app">
    <!-- Game Canvas -->
    <div id="game-container"></div>

    <!-- IDE Pedagógica de Sequenciamento -->
    <div id="editor-container">
      <h2>🧩 Painel de Comandos (Sequenciamento)</h2>
      <p>Monte a sequência correta para ajudar o dinossauro a nascer!</p>
      
      <div class="actions">
        <button onclick="addCommand('AQUECER')">🔥 Aquecer Ovo</button>
        <button onclick="addCommand('BATER')">🔨 Bater de Leve</button>
        <button onclick="addCommand('ESPERAR')">⏳ Esperar</button>
        <button onclick="clearProgram()" class="btn-clear">🗑️ Limpar</button>
      </div>

      <h3>Fila de Algoritmo:</h3>
      <ol id="program-queue"></ol>

      <button id="run-btn" onclick="executeAlgorithm()" class="btn-run">▶️ Executar Código</button>
      <div id="feedback-panel"></div>
    </div>
  </div>
  <script type="module" src="src/main.js"></script>
</body>
</html>

```

#### `public/style.css`

CSS

```
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Courier New', monospace; }
body { background-color: #1a1a24; color: #fff; display: flex; justify-content: center; padding: 20px; }
#app { display: flex; gap: 20px; background: #252538; padding: 20px; border-radius: 12px; border: 4px solid #4a4a6a; }
#game-container { border: 4px solid #000; image-rendering: pixelated; width: 400px; height: 400px; }
#editor-container { width: 380px; display: flex; flex-direction: column; gap: 10px; }
.actions button { padding: 10px; margin: 2px; cursor: pointer; background: #3d3d5c; border: 2px solid #6c5ce7; color: white; border-radius: 6px; font-weight: bold; }
.actions button:hover { background: #5649c0; }
#program-queue { background: #111; padding: 15px 30px; border-radius: 6px; min-height: 120px; }
.btn-run { background: #00b894; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; }
.btn-clear { background: #d63031 !important; border-color: #ff7675 !important; }
#feedback-panel { margin-top: 10px; font-weight: bold; min-height: 40px; color: #ffeaa7; }

```

#### `src/game/scenes/HatchScene.js`

JavaScript

```
export class HatchScene extends Phaser.Scene {
  constructor() {
    super('HatchScene');
  }

  preload() {
    // Carrega a spritesheet (2 linhas, 4 colunas = 8 frames)
    this.load.spritesheet('dino_hatch', 'assets/dino_hatch_sheet.png', {
      frameWidth: 128,  // Ajustar conforme dimensão real em pixels
      frameHeight: 128
    });
  }

  create() {
    // Configura fundo estilo pixel art
    this.cameras.main.setBackgroundColor('#2d572c');

    // Renderiza Sprite centralizado
    this.eggSprite = this.add.sprite(200, 200, 'dino_hatch', 0);
    this.eggSprite.setScale(2);

    // Criação das Animações
    this.anims.create({
      key: 'shake',
      frames: this.anims.generateFrameNumbers('dino_hatch', { start: 0, end: 2 }),
      frameRate: 6,
      repeat: 0
    });

    this.anims.create({
      key: 'crack',
      frames: this.anims.generateFrameNumbers('dino_hatch', { start: 2, end: 4 }),
      frameRate: 4,
      repeat: 0
    });

    this.anims.create({
      key: 'hatch_complete',
      frames: this.anims.generateFrameNumbers('dino_hatch', { start: 5, end: 7 }),
      frameRate: 3,
      repeat: -1
    });
  }

  // Métodos expostos para o Interpretador de Código
  playShake() {
    return new Promise(resolve => {
      this.eggSprite.play('shake');
      this.eggSprite.once('animationcomplete', () => resolve());
    });
  }

  playCrack() {
    return new Promise(resolve => {
      this.eggSprite.play('crack');
      this.eggSprite.once('animationcomplete', () => resolve());
    });
  }

  playHatch() {
    return new Promise(resolve => {
      this.eggSprite.play('hatch_complete');
      resolve();
    });
  }
}

```

#### `src/interpreter/sequenceRunner.js`

JavaScript

```
export class SequenceRunner {
  constructor(scene) {
    this.scene = scene;
    this.expectedSequence = ['AQUECER', 'BATER', 'ESPERAR'];
  }

  async run(userCommands) {
    const feedback = document.getElementById('feedback-panel');
    feedback.innerText = "🤖 Executando algoritmo...";

    for (let i = 0; i < userCommands.length; i++) {
      const cmd = userCommands[i];
      
      if (cmd === 'AQUECER') {
        await this.scene.playShake();
      } else if (cmd === 'BATER') {
        await this.scene.playCrack();
      } else if (cmd === 'ESPERAR') {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    // Validação Pedagógica
    const isCorrect = JSON.stringify(userCommands) === JSON.stringify(this.expectedSequence);

    if (isCorrect) {
      await this.scene.playHatch();
      feedback.innerText = "🎉 PARABÉNS! Você programou a sequência perfeita e o Dinossauro nasceu!";
    } else {
      feedback.innerText = "💡 Ops! O dinossauro não nasceu. Verifique a ordem dos comandos (Dica: Aqueça, Bata e Espere).";
    }
  }
}

```

#### `src/main.js`

JavaScript

```
import { HatchScene } from './game/scenes/HatchScene.js';
import { SequenceRunner } from './interpreter/sequenceRunner.js';

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  parent: 'game-container',
  pixelArt: true,
  scene: [HatchScene]
};

const game = new Phaser.Game(config);
let programQueue = [];
let runner = null;

// Sincronização Socket.io para persistência do Tamagotchi
const socket = io();

window.addCommand = function(cmd) {
  programQueue.push(cmd);
  renderQueue();
};

window.clearProgram = function() {
  programQueue = [];
  renderQueue();
  document.getElementById('feedback-panel').innerText = "";
};

function renderQueue() {
  const ol = document.getElementById('program-queue');
  ol.innerHTML = programQueue.map(c => `<li>${c}</li>`).join('');
}

window.executeAlgorithm = async function() {
  if (!runner) {
    const scene = game.scene.getScene('HatchScene');
    runner = new SequenceRunner(scene);
  }
  await runner.run(programQueue);
  socket.emit('step_completed', { sequence: programQueue });
};

```

#### `server/index.js`

JavaScript

```
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));
app.use('/src', express.static(path.join(__dirname, '../src')));

// Estado Server-side do Tamagotchi
let tamagotchiState = {
  hatched: false,
  hunger: 100,
  energy: 100
};

io.on('connection', (socket) => {
  console.log('⚡ Aluno conectado:', socket.id);
  socket.emit('state_update', tamagotchiState);

  socket.on('step_completed', (data) => {
    console.log('Algoritmo recebido:', data.sequence);
    // Validação server-side
    if (JSON.stringify(data.sequence) === JSON.stringify(['AQUECER', 'BATER', 'ESPERAR'])) {
      tamagotchiState.hatched = true;
      io.emit('state_update', tamagotchiState);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor DinoLogic rodando na porta ${PORT}`);
});

```

## 🎯 Instruções Finais para Execução do OpenCode

1. Execute a criação da árvore de pastas e crie as **Skills** em `.opencode/skills/`.

2. Instale as dependências usando `npm install`.

3. Certifique-se de salvar a imagem de spritesheet enviada em `public/assets/dino_hatch_sheet.png`.   

4. Inicie o servidor com `npm run dev` e acesse `http://localhost:3000`.