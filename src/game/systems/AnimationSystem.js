const HATCH_ANIMS = [
  { key: 'shake', start: 0, end: 1, frameRate: 6, repeat: 0 },
  { key: 'crack', start: 1, end: 3, frameRate: 4, repeat: 0 },
  { key: 'hatch_complete', start: 3, end: 10, frameRate: 4, repeat: 0 },
  { key: 'dino_idle', frames: [10, 11], frameRate: 1.5, repeat: -1 }
];

export class AnimationSystem {
  static createAll(scene) {
    AnimationSystem.createHatchAnimations(scene);
  }

  static createHatchAnimations(scene) {
    for (const def of HATCH_ANIMS) {
      if (scene.anims.exists(def.key)) continue;
      const frames = def.frames
        ? def.frames.map((f) => ({ key: 'dino_hatch', frame: f }))
        : scene.anims.generateFrameNumbers('dino_hatch', { start: def.start, end: def.end });
      scene.anims.create({
        key: def.key,
        frames,
        frameRate: def.frameRate,
        repeat: def.repeat
      });
    }
  }
}
