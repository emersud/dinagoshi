import { GAME_WIDTH, GAME_HEIGHT, SPRITE_SCALE, WAIT_MS } from '../config.js';
import { AnimationSystem } from '../systems/AnimationSystem.js';

export class HatchScene extends Phaser.Scene {
  constructor() {
    super('HatchScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#2d572c');
    AnimationSystem.createAll(this);

    this.add.circle(GAME_WIDTH / 2, GAME_HEIGHT - 40, 90, 0x1e3f1d);
    this.eggSprite = this.add
      .sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, 'dino_hatch', 0)
      .setScale(SPRITE_SCALE)
      .setFrame(0);
  }

  playAnimation(key) {
    return new Promise((resolve) => {
      this.eggSprite.play(key, true);
      this.eggSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, resolve);
    });
  }

  playShake() {
    return this.playAnimation('shake');
  }

  playCrack() {
    return this.playAnimation('crack');
  }

  playHatch() {
    return this.playAnimation('hatch_complete').then(() => {
      this.eggSprite.play('dino_idle', true);
    });
  }

  wait(ms = WAIT_MS) {
    return new Promise((resolve) => this.time.delayedCall(ms, resolve));
  }

  resetEgg() {
    this.eggSprite.stop();
    this.eggSprite.setFrame(0);
  }
}
