export type IronManAnimationName =
  | "idle" | "run" | "turning" | "lookingUp"
  | "crouching" | "jumping" | "doubleJump" | "dashing";

export interface SpriteFrameRect {
  x: number;
  width: number;
}

export interface SpriteSheetAnimationConfig {
  key: string;
  textureKey: string;
  asset: string;
  frameHeight: number;
  frames: readonly SpriteFrameRect[];
  frameRate: number;
  repeat: number;
}

const asset = (file: string) => `/assets/ironman/ironman_${file}.png`;
const frames = (...pairs: readonly [number, number][]): SpriteFrameRect[] =>
  pairs.map(([x, width]) => ({ x, width }));

// These strips contain tightly packed, variable-width frames. Explicit frame
// rectangles keep the extracted source art untouched and prevent frame slicing.
export const ironManAnimations: Record<IronManAnimationName, SpriteSheetAnimationConfig> = {
  idle: {
    key: "ironman-idle", textureKey: "ironman-idle-sheet", asset: asset("idle"),
    frameHeight: 32,
    frames: frames([2, 26], [31, 26], [60, 28], [91, 27], [122, 26], [152, 25], [180, 26]),
    frameRate: 7, repeat: -1,
  },
  run: {
    key: "ironman-run", textureKey: "ironman-run-sheet", asset: asset("run"),
    frameHeight: 32,
    frames: frames([0, 25], [29, 24], [56, 22], [82, 14], [99, 19], [121, 26], [150, 25], [179, 22], [204, 17], [224, 21]),
    frameRate: 14, repeat: -1,
  },
  turning: {
    key: "ironman-turning", textureKey: "ironman-turning-sheet", asset: asset("turning_around"),
    frameHeight: 37, frames: frames([0, 28]), frameRate: 8, repeat: 0,
  },
  lookingUp: {
    key: "ironman-looking-up", textureKey: "ironman-looking-up-sheet", asset: asset("looking_up"),
    frameHeight: 37, frames: frames([0, 27]), frameRate: 6, repeat: -1,
  },
  crouching: {
    key: "ironman-crouching", textureKey: "ironman-crouching-sheet", asset: asset("crouching"),
    frameHeight: 25, frames: frames([0, 24], [27, 23]), frameRate: 8, repeat: -1,
  },
  jumping: {
    key: "ironman-jumping", textureKey: "ironman-jumping-sheet", asset: asset("jumping"),
    frameHeight: 41,
    frames: frames([0, 28], [31, 23], [58, 27], [88, 28], [119, 27], [150, 27], [180, 23], [207, 23], [233, 23], [259, 23], [286, 23]),
    frameRate: 12, repeat: 0,
  },
  doubleJump: {
    key: "ironman-double-jump", textureKey: "ironman-double-jump-sheet", asset: asset("double_jump"),
    frameHeight: 64,
    frames: frames([0, 28], [31, 32], [66, 35], [104, 41], [150, 52], [203, 43], [253, 30], [286, 28], [317, 27], [348, 27], [378, 28], [409, 27], [440, 23], [466, 23], [493, 22], [518, 24], [545, 23]),
    frameRate: 15, repeat: 0,
  },
  dashing: {
    key: "ironman-dashing", textureKey: "ironman-dashing-sheet", asset: asset("dashing"),
    frameHeight: 29, frames: frames([0, 40], [44, 40], [87, 41]), frameRate: 14, repeat: -1,
  },
};
