/** @param ratio - Value between 0 and 1, 0 representing the bound1, 1 the bound2 */
export default function interpolate (
  ratio: number,
  bound1: number,
  bound2: number): number {
  return bound1 + ratio * (bound2 - bound1)
}
