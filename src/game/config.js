export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 400;
export const FRAME_WIDTH = 362;
export const FRAME_HEIGHT = 362;
export const SPRITE_SCALE = 1;

export const EXPECTED_SEQUENCE = ['AQUECER', 'BATER', 'ESPERAR'];

export const COMMAND_LABELS = {
  AQUECER: '🔥 Aquecer o ovo',
  BATER: '🔨 Bater de leve',
  ESPERAR: '⏳ Esperar'
};

export const COMMAND_ACTIONS = {
  AQUECER: 'playShake',
  BATER: 'playCrack',
  ESPERAR: 'wait'
};

export const WAIT_MS = 1000;
