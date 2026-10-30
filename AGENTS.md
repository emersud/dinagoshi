# Instruções do Projeto DinoLogic

## REGRA DE LOG OBRIGATÓRIA

**TODA ação executada pelo agente — concluída com sucesso OU falhada/abortada — DEVE ser registrada como uma entrada nova no arquivo `log.txt` na raiz do projeto (`C:\Dinagoshi\log.txt`).**

Formato da entrada (uma linha por ação):

```
[yyyy-MM-dd HH:mm:ss] [CONTEXTO] descricao-da-acao | detalhes | result=ok|falha|erro
```

Regras:

1. Registrar **antes** de iniciar uma ação relevante (`result=em_andamento` é opcional) e **sempre** registrar o desfecho (`result=ok`, `result=falha` ou `result=erro`).
2. Ações que falharam, foram interrompidas ou decididas como não executadas **também** geram entrada — nunca omitir falhas.
3. Contextos usados: `ETAPA` (fases do projeto), `SKILL` (invocação de skills), `FILE` (criação/edição de arquivos), `CMD` (comandos shell), `SOCKET`/`DECAY`/`PERSIST` (ações do servidor do jogo), `AGENT` (decisões do agente).
4. Nunca usar o log para dados sensíveis (senhas, tokens).
5. O servidor do jogo (`server/logger.js`) também escreve neste mesmo `log.txt` com os contextos `SOCKET`, `DECAY` e `PERSIST`.

## Stack aprovado

- Phaser 3.80.1 + JavaScript (client), Node.js + Express + Socket.io (server).
- Skills carregadas de `opencode/skills` (registradas em `opencode.json`).
- Estrutura do projeto na raiz: `public/`, `src/`, `server/`.

## Convenções

- Nomes de skill = nome da pasta (frontmatter `name`).
- Feedback pedagógico sempre segue: contextualização → analogia → prática guiada → reflexão (skill `educational-pedagogy`).
- Animations centralizadas em um único sistema, nunca `anims.create` espalhado (skill `game-architecture`).
