import Phaser from "phaser";
import { ironManAnimations } from "./ironManAnimations";

export function preloadIronManSprites(scene: Phaser.Scene) {
  Object.values(ironManAnimations).forEach((animation) => {
    scene.load.image(animation.textureKey, animation.asset);
  });
}

export function registerIronManAnimations(scene: Phaser.Scene) {
  Object.values(ironManAnimations).forEach((animation) => {
    if (scene.anims.exists(animation.key) || !scene.textures.exists(animation.textureKey)) return;

    const texture = scene.textures.get(animation.textureKey);
    const animationFrames = animation.frames.flatMap((frame, index) => {
      const frameName = `${animation.key}-${index}`;
      const added = texture.add(frameName, 0, frame.x, 0, frame.width, animation.frameHeight);
      return added ? [{ key: animation.textureKey, frame: frameName }] : [];
    });

    if (animationFrames.length === 0) return;
    scene.anims.create({
      key: animation.key,
      frames: animationFrames,
      frameRate: animation.frameRate,
      repeat: animation.repeat,
    });
  });
}
