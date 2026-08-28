import Phaser from "phaser";
import { ironManAnimations } from "@/game/animations/ironManAnimations";
import { PlayerInput } from "@/game/input/PlayerInput";
import { MOVEMENT } from "@/game/physics/movement";

export enum IronManState {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
  JUMPING = "JUMPING",
  DOUBLE_JUMPING = "DOUBLE_JUMPING",
  CROUCHING = "CROUCHING",
  LOOKING_UP = "LOOKING_UP",
  TURNING = "TURNING",
  DASHING = "DASHING",
}

type FacingDirection = "left" | "right";

export class IronMan extends Phaser.Physics.Arcade.Sprite {
  private readonly controls: PlayerInput;
  private readonly bodySourceWidth: number;
  private readonly bodySourceHeight: number;
  private movementState: IronManState | null = null;
  private facing: FacingDirection = "right";
  private jumpCount = 0;
  private wasGrounded = false;
  private turningUntil = 0;
  private lastRightTapAt = Number.NEGATIVE_INFINITY;
  private dashUntil = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.controls = new PlayerInput(scene);
    this.setCollideWorldBounds(true)
      .setScale(2)
      .setMaxVelocity(MOVEMENT.dashSpeed, MOVEMENT.maxFallSpeed)
      .setOrigin(0.5, 1);

    const body = this.body as Phaser.Physics.Arcade.Body;
    this.bodySourceWidth = Math.max(20, this.width * 0.45);
    this.bodySourceHeight = Math.max(24, this.height * 0.85);
    body.setSize(this.bodySourceWidth, this.bodySourceHeight);
    this.alignBodyToFrame();
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.alignBodyToFrame();
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const grounded = body.blocked.down || body.touching.down;
    if (grounded && !this.wasGrounded) this.jumpCount = 0;
    this.wasGrounded = grounded;

    const horizontal = Number(this.controls.right) - Number(this.controls.left);
    const nextFacing: FacingDirection = horizontal < 0 ? "left" : "right";

    if (this.controls.rightPressed && grounded) {
      const now = this.scene.time.now;
      if (now - this.lastRightTapAt <= MOVEMENT.doubleTapWindow) {
        this.dashUntil = now + MOVEMENT.dashDuration;
        this.lastRightTapAt = Number.NEGATIVE_INFINITY;
      } else {
        this.lastRightTapAt = now;
      }
    }

    if (this.scene.time.now < this.dashUntil) {
      this.facing = "right";
      this.setFlipX(false);
      this.setVelocityX(MOVEMENT.dashSpeed);
      this.setMovementState(IronManState.DASHING);
      return;
    }

    if (horizontal !== 0 && nextFacing !== this.facing && grounded) {
      this.facing = nextFacing;
      this.setFlipX(this.facing === "left");
      this.turningUntil = this.scene.time.now + 220;
    } else if (horizontal !== 0) {
      this.facing = nextFacing;
      this.setFlipX(this.facing === "left");
    }

    const speed = this.controls.sprint ? MOVEMENT.sprintSpeed : MOVEMENT.walkSpeed;
    const movementLocked = grounded && (this.controls.down || (this.controls.up && horizontal === 0));
    this.setVelocityX(movementLocked ? 0 : horizontal * speed);

    if (this.controls.jumpPressed && this.jumpCount < 2) {
      this.jumpCount += 1;
      this.setVelocityY(this.jumpCount === 1 ? -MOVEMENT.jumpVelocity : -MOVEMENT.doubleJumpVelocity);
      this.setMovementState(this.jumpCount === 1 ? IronManState.JUMPING : IronManState.DOUBLE_JUMPING);
      return;
    }

    if (!grounded) {
      this.setMovementState(this.jumpCount >= 2 ? IronManState.DOUBLE_JUMPING : IronManState.JUMPING);
    } else if (this.scene.time.now < this.turningUntil) {
      this.setMovementState(IronManState.TURNING);
    } else if (this.controls.down) {
      this.setMovementState(IronManState.CROUCHING);
    } else if (this.controls.up && horizontal === 0) {
      this.setMovementState(IronManState.LOOKING_UP);
    } else if (horizontal !== 0) {
      this.setMovementState(IronManState.RUNNING);
    } else {
      this.setMovementState(IronManState.IDLE);
    }
  }

  private setMovementState(nextState: IronManState) {
    if (nextState === this.movementState) return;
    this.movementState = nextState;

    const animationKey = {
      [IronManState.IDLE]: ironManAnimations.idle.key,
      [IronManState.RUNNING]: ironManAnimations.run.key,
      [IronManState.JUMPING]: ironManAnimations.jumping.key,
      [IronManState.DOUBLE_JUMPING]: ironManAnimations.doubleJump.key,
      [IronManState.CROUCHING]: ironManAnimations.crouching.key,
      [IronManState.LOOKING_UP]: ironManAnimations.lookingUp.key,
      [IronManState.TURNING]: ironManAnimations.turning.key,
      [IronManState.DASHING]: ironManAnimations.dashing.key,
    }[nextState];

    if (this.scene.anims.exists(animationKey)) {
      this.play(animationKey, true);
      this.alignBodyToFrame();
    }
  }

  private alignBodyToFrame() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setOffset(
      (this.width - this.bodySourceWidth) / 2,
      this.height - this.bodySourceHeight,
    );
  }
}
