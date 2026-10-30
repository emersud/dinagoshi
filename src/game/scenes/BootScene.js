export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1a24');
    this.add.text(200, 190, 'DinoLogic', {
      fontFamily: 'Courier New',
      fontSize: '32px',
      color: '#ffeaa7'
    }).setOrigin(0.5);
    this.add.text(200, 230, 'Preparando o ovo...', {
      fontFamily: 'Courier New',
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.scene.start('PreloadScene');
  }
}
