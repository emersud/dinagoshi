import { FRAME_WIDTH, FRAME_HEIGHT } from '../config.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    const bar = this.add.rectangle(200, 200, 300, 20, '#3d3d5c').setOrigin(0.5);
    const fill = this.add.rectangle(50, 200, 0, 16, '#6c5ce7').setOrigin(0, 0.5);
    this.add.text(200, 170, 'Carregando assets...', {
      fontFamily: 'Courier New',
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.load.on('progress', (p) => {
      fill.width = 300 * p;
    });

    this.load.spritesheet('dino_hatch', 'assets/dino_hatch_sheet_02.png', {
      frameWidth: FRAME_WIDTH,
      frameHeight: FRAME_HEIGHT
    });
  }

  create() {
    this.scene.start('HatchScene');
  }
}
