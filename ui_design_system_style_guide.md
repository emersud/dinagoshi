# 🦖 Guia de Estilo de UI / UX — Jogo de Dinossauros

Este documento extrai e formaliza os padrões visuais (botões, janelas, sombras, tabelas, placares e elementos de interface) com base nas imagens de referência, adaptando-os para um tema pré-histórico/aventura.

---

## 🎨 1. Paleta de Cores (Color Palette)

### Cores Principais (Botões & Ações Primárias)
- **Laranja Vibrante (Principal):** `#FF6B2B`
- **Laranja Claro (Gradiente Superior):** `#FF9442`
- **Laranja Escuro (Gradiente Inferior / Sombra do Botão):** `#C84000`
- **Amarelo Destaque (Estrelas & Ouro):** `#FFC82B`

### Estruturas & Painéis (Containers / Modais)
- **Cinza Pedra / Metal Escuro (Moldura Externa):** `#3E444F`
- **Cinza Sombra Integrada:** `#242830`
- **Bege / Pergaminho (Fundo dos Painéis Internos):** `#FFE0AD`
- **Creme Claro (Cards e Itens da Lista):** `#FFF2D1`

### Tipografia & Ícones
- **Texto Principal (Branco com Contorno):** `#FFFFFF` (Stroke: `#802800` de 2px a 4px)
- **Texto Secundário (Tabelas / Escuro):** `#8C4B18` ou `#4A2E12`

---

## 🔘 2. Estilo de Botões (Button Styles)

Os botões possuem um estilo **3D Skeuomorphic/Casual Mobile**, com cantos arredondados, bordas destacadas e sombras direcionais abaixo.

### Botões Primários (Retangulares com Texto)
- **Border Radius:** `16px` a `24px`
- **Gradiente:** Vertical de `#FF9442` (topo) para `#FF6B2B` (base).
- **Borda/Stroke:** `3px` sólida com tom claro `#FFC82B` ou branco translúcido no topo.
- **Sombra 3D (Efeito Press/Profundidade):** `box-shadow: 0px 6px 0px #C84000;`
- **Estado Hover:** Leve aumento de brilho / escala (`scale(1.03)`).
- **Estado Active (Clique):** `transform: translateY(4px); box-shadow: 0px 2px 0px #C84000;`

### Botões Circulares (Ícones: Fechar, Pause, Configurações, Som)
- **Formato:** Círculo perfeito (`border-radius: 50%`).
- **Tamanho Padrão:** `48px x 48px` ou `64px x 64px`.
- **Anel Externo (Borda):** Borda dupla — anel externo `#FFFFFF` e fundo interno `#FF6B2B`.
- **Sombra 3D:** `box-shadow: 0px 4px 0px #A63200;`

---

## 🖼️ 3. Painéis, Modais & Forms (Containers)

### Painel Principal (Modal / Moldura)
- **Estilo:** Estilo pedra/fossilizado ou metal escuro.
- **Borda Externa:** Cantos levemente arredondados (`border-radius: 20px`), textura com parafusos ou entalhes de pedra nos cantos.
- **Background Interno:** `#3E444F` com borda interna rebaixada (`inset shadow`).

### Sub-painel Interno (Área de Conteúdo)
- **Fundo:** `#FFE0AD` (Pergaminho / Areia).
- **Borda:** Sólida `#C88A36` de 3px.
- **Sombra Interna:** `box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.25);`

### Títulos de Janelas (Header Badges)
- **Aba de Título:** Formato de pílula retangular arredondada posicionada sobreposta na parte superior do painel (`margin-top: -20px`).
- **Cor:** Laranja Intenso (`#FF6B2B`) ou Roxo Aventura (`#7C4DFF` para destaques de vitória).
- **Texto:** Caixa alta (`PAUSE`, `RATING`, `YOU WIN`), cor branca com borda escura.

---

## 📊 4. Mini Tabelas & Listas (Rankings e Inventário)

### Linha / Card de Tabela (Ranking de Jogadores)
- **Fundo da Linha:** `#FFF2D1` com cantos arredondados (`10px`).
- **Sombra:** `box-shadow: 0px 2px 4px rgba(0,0,0,0.1);`
- **Avatar / Ícone:** Quadrado com cantos arredondados (`8px`) à esquerda em tom marrom escuro ou ícone de dinossauro/pegada.
- **Posição / Ranking (Badge):** Círculo pequeno `#FF6B2B` com número em branco à direita.

### Grid de Recompensas / Inventário (Grade de Itens)
- **Matriz:** Quadrados de `3x3` ou `4x3`.
- **Card Individual:** Fundo `#FFD485`, borda `#E59A35` de 2px.
- **Indicador de Quantidade:** Texto na parte inferior (`3x`, `1x`) em tom marrom escuro `#633200`.

---

## 🏆 5. Pontuações, Recursos e HUD (Score & HUD)

### Indicadores de Recursos (Moedas, Gemas, Dentes de Dino)
- **Formato:** Pílula/Cápsula alongada.
- **Background:** `#FF7A30` com borda escura.
- **Ícone do Recurso:** Sobreposto na extremidade esquerda, ultrapassando ligeiramente o limite da cápsula (efeito 3D/Pop-out).
- **Texto de Valor:** Cor branca, alinhado à direita, fonte *Bold Display*.

### Classificação por Estrelas (Star Rating System)
- **Estrelas Ativas:** Amarelo `#FFD700` com brilho e borda marrom/laranja.
- **Estrelas Inativas:** Opacidade reduzida ou tom cinza-azulado.
- **Efeito Visual:** Estrela central maior (`scale(1.2)`) para criar simetria centralizada.

---

## 👥 6. Barramentos e Progressão (Sliders & Toggle Switches)

### Barra de Progresso / Scrollbar
- **Trilho (Track):** Vertical ou horizontal em tom `#FF7A30` com bordas brancas/claras.
- **Indicador (Thumb):** Botão circular `#FF9442` com borda e sombra inferior 3D.

### Chaves de Liga/Desliga (Toggle Switches)
- **Estado OFF:** Cápsula `#FF6B2B` com círculo à direita e texto "OFF".
- **Estado ON:** Cápsula `#FF8800` ou Verde Aventura com círculo no lado oposto.

---

## 💡 7. Sugestões Temáticas para o Universo de Dinossauros

1. **Texturas:** Substituir o cinza metálico simples por **pedra esculpida** ou **madeira rústica / amarrações de cipó**.
2. **Ícones:**
   - Trocar gemas/moedas por **Ovos de Dinossauro**, **Dentes de T-Rex** ou **Fósseis/Âmbar**.
   - Substituir botões de seta por **Pegadas de Dinossauro**.
3. **Placas de Título:** Molduras no formato de **ossos cross-bones** ou **placas de madeira talhada**.