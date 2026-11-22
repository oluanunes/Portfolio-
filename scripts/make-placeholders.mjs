// Gera as fotos de substituição (degradês, sem texto) em src/assets/photos/<area>/NN.jpg.
// Idempotente: sobrescreve os arquivos. Fotos reais entram com os mesmos nomes.
// Uso: npm run photos
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'assets', 'photos');
const WIDTH = 1920;
const HEIGHT = 1280;
const COUNT = 8;

// Tons de cada área (iguais aos da prévia). `angle` em graus (CSS), `stops` em hex.
const AREAS = {
  landscape: { angle: 165, stops: [['#22303a', 0], ['#4d4a3f', 55], ['#b9803f', 100]] },
  portrait: { angle: 160, stops: [['#352c31', 0], ['#6a4c47', 60], ['#b98d6b', 100]] },
  commercial: { angle: 160, stops: [['#171b22', 0], ['#3a3f4b', 58], ['#8a6a3b', 100]] },
};

const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));

/** Clareia (>0) ou escurece (<0) uma cor hex em `amount` (-1 a 1). */
function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    clamp(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount)),
  );
  return `#${ch.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/** Eixo do degradê como em CSS linear-gradient(<angle>deg): 0deg = de baixo para cima. */
function gradientVector(angle) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const half = (Math.abs(WIDTH * dx) + Math.abs(HEIGHT * dy)) / 2;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  return { x1: cx - dx * half, y1: cy - dy * half, x2: cx + dx * half, y2: cy + dy * half };
}

function svgFor({ angle, stops }, index) {
  // Cada foto varia um pouco: ângulo (-14° a +14°) e luminosidade (cerca de -9% a +9%).
  const a = angle + (index - (COUNT - 1) / 2) * 4;
  const light = ((index % 4) - 1.5) * 0.05 + (index < COUNT / 2 ? -0.02 : 0.02);
  const v = gradientVector(a);
  const stopTags = stops
    .map(([hex, pos]) => `<stop offset="${pos}%" stop-color="${shade(hex, light)}"/>`)
    .join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">` +
    `<defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${v.x1.toFixed(1)}" y1="${v.y1.toFixed(1)}" x2="${v.x2.toFixed(1)}" y2="${v.y2.toFixed(1)}">${stopTags}</linearGradient></defs>` +
    `<rect width="100%" height="100%" fill="url(#g)"/></svg>`
  );
}

for (const [area, spec] of Object.entries(AREAS)) {
  const dir = join(outDir, area);
  await mkdir(dir, { recursive: true });
  for (let i = 0; i < COUNT; i++) {
    const file = join(dir, `${String(i + 1).padStart(2, '0')}.jpg`);
    await sharp(Buffer.from(svgFor(spec, i)))
      .resize(WIDTH, HEIGHT)
      .jpeg({ quality: 70, mozjpeg: true })
      .toFile(file);
  }
  console.log(`${area}: ${COUNT} fotos em ${dir}`);
}
