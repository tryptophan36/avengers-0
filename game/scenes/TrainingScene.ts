import Phaser from "phaser";
import { preloadIronManSprites, registerIronManAnimations } from "@/game/animations/registerIronManAnimations";
import { ironManAnimations } from "@/game/animations/ironManAnimations";
import { IronMan } from "@/game/characters/IronMan";

const WORLD_WIDTH = 3_200;
const WORLD_HEIGHT = 540;
const GROUND_Y = 470;
const FALLBACK_TEXTURE = "ironman-placeholder";

export class TrainingScene extends Phaser.Scene {
  private ironMan?: IronMan;

  constructor() {
    super("training-scene");
  }

  preload() {
    preloadIronManSprites(this);
  }

  create() {
    registerIronManAnimations(this);
    this.createBackdrop();
    const ground = this.createGround();
    const texture = this.getIronManTexture();

    this.ironMan = new IronMan(this, 360, GROUND_Y - 16, texture.key, texture.frame);
    this.physics.add.collider(this.ironMan, ground);

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main
      .setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
      .startFollow(this.ironMan, true, 0.12, 1)
      .setDeadzone(160, 540);
  }

  update() {
    this.ironMan?.update();
  }

  private getIronManTexture() {
    const idleTexture = ironManAnimations.idle.textureKey;
    if (this.textures.exists(idleTexture)) {
      return { key: idleTexture, frame: `${ironManAnimations.idle.key}-0` };
    }

    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x8f1820).fillRect(10, 4, 28, 44);
    graphics.fillStyle(0xf0b83f).fillRect(16, 8, 16, 12);
    graphics.fillStyle(0x7bdcf4).fillRect(21, 25, 6, 6);
    graphics.generateTexture(FALLBACK_TEXTURE, 48, 48);
    graphics.destroy();
    return { key: FALLBACK_TEXTURE, frame: undefined };
  }

  private createBackdrop() {
    this.cameras.main.setBackgroundColor(0x090d18);
    const skyline = this.add.graphics();
    skyline.fillStyle(0x111827);
    for (let x = 0; x < WORLD_WIDTH; x += 150) {
      const height = 80 + ((x / 150) % 4) * 25;
      skyline.fillRect(x, GROUND_Y - height, 110, height);
    }

    const guide = this.add.graphics().lineStyle(1, 0x26344f, 0.7);
    for (let x = 0; x < WORLD_WIDTH; x += 160) guide.lineBetween(x, 0, x, GROUND_Y);
  }

  private createGround() {
    const ground = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y + 35, WORLD_WIDTH, 70, 0x171b25);
    ground.setStrokeStyle(3, 0xe1a938);
    this.physics.add.existing(ground, true);
    return ground;
  }
}
