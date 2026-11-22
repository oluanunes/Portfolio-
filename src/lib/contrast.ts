const HEX = /^#[0-9a-f]{6}$/i;

function luminance(hex: string): number {
  if (typeof hex !== 'string' || !HEX.test(hex)) {
    throw new Error(`Cor inválida: esperado hex de 6 dígitos (#rrggbb), recebido ${JSON.stringify(hex)}`);
  }
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a >= b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}
