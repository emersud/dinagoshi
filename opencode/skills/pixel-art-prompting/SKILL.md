---
name: pixel-art-prompting
description: Diretrizes para engenharia de prompt e geração procedural de spritesheets em Pixel Art alinhados em grid (frameWidth/frameHeight exatos, sem anti-aliasing, paleta limitada). Triggers em: pixel art, spritesheet, gerar sprite, arte do jogo, grid de frames, dino_hatch_sheet.
license: MIT
compatibility: opencode
metadata:
  audience: game-developers
  domain: pixel-art
  language: pt-br
  category: art-generation
---

# Pixel Art Prompting

## O que eu faço

Produzo (ou dirijo a geração de) spritesheets em Pixel Art prontos para Phaser,
garantindo que o grid de frames seja matematicamente perfeito.

---

# Regras Inegociáveis de Grid

1. **Frames uniformes**: todos os frames têm exatamente `frameWidth × frameHeight`.
2. **Sheet retangular**: `colunas × frameWidth` = largura total; `linhas × frameHeight` = altura total.
3. **Zero anti-aliasing**: cada pixel de arte é uma cor pura; nada de interpolação.
4. **Sem bleed**: nenhum traço cruza a borda entre frames.
5. **Alpha real**: fundo transparente (PNG-24) ou fundo sólido único.

Exemplo DinoLogic (eclosão 4×2 de 128px):

```text
Largura = 4 × 128 = 512
Altura  = 2 × 128 = 256
Sheet   = 512 × 256
Frame 0 = (0,0)     Frame 1 = (128,0)    Frame 2 = (256,0)    Frame 3 = (384,0)
Frame 4 = (0,128)   Frame 5 = (128,128)  Frame 6 = (256,128)  Frame 7 = (384,128)
```

---

# Template de Prompt (para gerar/direcionar a arte)

```text
[PALAVRAS-CHAVE] pixel art, 16-bit, isometric OR side-view, retro game asset
[SUBJETO]        dinossauro bebê saindo do ovo
[GRID]           spritesheet N colunas x M linhas, frame WxH px, fundo transparente
[PALETA]         máx. 8 cores + 1 cor de contorno
[ANIMAÇÃO]       lista dos estados, frame a frame, em ordem de leitura (linha 1 → linha 2)
[RESTRIÇÕES]     sem anti-aliasing, sem sombras suaves, pixel perfeito, sem texto
```

---

# Paleta Padrão DinoLogic

| Uso | Cor |
|---|---|
| Contorno | `#1a1a24` |
| Ovo (claro) | `#f5f0e1` |
| Ovo (sombra) | `#cfc7b0` |
| Rachadura | `#8a8264` |
| Dino (corpo) | `#4ecb71` |
| Dino (sombra) | `#2e8b57` |
| Olho | `#1a1a24` |
| Brilho olho | `#ffffff` |

---

# Storyboard do Spritesheet de Eclosão (8 frames)

## Linha 1 — Ovo intacto → rachaduras

| Frame | Descrição |
|---|---|
| 0 | Ovo intacto, apoiado, sem detalhes |
| 1 | Ovo com leve inclinação (tremor) |
| 2 | Ovo de volta ao centro, primeira rachadura no topo |
| 3 | Rachadura ramificando para os lados |

## Linha 2 — Eclosão → dino olhando

| Frame | Descrição |
|---|---|
| 4 | Topo do ovo aberto, casco separado |
| 5 | Cabeça do dino emergindo pela abertura |
| 6 | Dino quase inteiro de fora, olhando à frente |
| 7 | Dino completo, olhando para os lados, cauda visível |

---

# Regras de Animação no Phaser

```js
this.load.spritesheet('dino_hatch', 'assets/dino_hatch_sheet.png', {
  frameWidth: 128,
  frameHeight: 128
});
```

- `frameRate` entre 3 e 8 fps (pixel art "lê" melhor devagar).
- Animações de eclosão: `repeat: 0`; loops de idle: `repeat: -1`.
- Usar `frameStart`/`frameEnd` por linha para animar estágios separados.

---

# Checklist de Entrega

- [ ] `largura % frameWidth === 0` e `altura % frameHeight === 0`
- [ ] Phaser carrega sem erro de frame parcial
- [ ] Nenhum pixel vaza entre frames
- [ ] Paleta ≤ 8 cores coerentes entre si
- [ ] Animação lê como uma história, da esquerda p/ direita, linha a linha

---

# Quando me utilizar

- Gerar ou auditar spritesheets do DinoLogic
- Criar novos assets (fome, sono, brincadeira, medalhas)
- Escrever prompts de arte para ferramentas externas
- Validar dimensões de sheets existentes antes de codificar
