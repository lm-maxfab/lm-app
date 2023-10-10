export default function absoluteModulo (nbr: number, modulo: number): any {
  return ((nbr % modulo) + modulo) % modulo
}
