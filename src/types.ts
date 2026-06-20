export type EffectType = 'none' | 'snowflakes' | 'balloons';

export interface SnowflakeItem {
  id: string;
  x: number; // percentage from left (0 to 100)
  size: number; // medium size in pixels
  opacity: number;
  duration: number; // speed of falling in seconds
  sway: number; // amplitude of side-drift
  swayDuration: number; // duration of sway cycle
  rotationSpeed: number; // degrees of rotation per second
}

export interface BalloonItem {
  id: string;
  x: number; // percentage from left (0 to 100)
  size: number; // width in pixels
  aspectRatio: number; // height/width ratio
  color: string; // hex code of elegant color
  duration: number; // float speed in seconds
  sway: number; // horizontal drift amplitude
  swayDuration: number; // speed of sway
  tilt: number; // initial tilt angle
}
