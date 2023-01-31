// num between 0 and 1
export default function interpolate (num: number, bound1: number, bound2: number): number {
  return bound1 + num * (bound2 - bound1)
}
