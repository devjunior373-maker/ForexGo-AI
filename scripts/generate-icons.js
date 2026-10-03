import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Ensure public directory exists
const publicDir = path.resolve('./public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate an SVG file
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f18" />
      <stop offset="50%" stop-color="#121824" />
      <stop offset="100%" stop-color="#05080e" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF" />
      <stop offset="100%" stop-color="#0097A7" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="url(#bgGrad)" />

  <!-- Circuit traces left -->
  <g stroke="#00BCD4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" filter="url(#glow)">
    <path d="M 60 180 L 110 180 L 140 210 L 170 210" fill="none" />
    <circle cx="60" cy="180" r="5" fill="#00E5FF" />
    
    <path d="M 40 240 L 95 240 L 135 256 L 165 256" fill="none" />
    <circle cx="40" cy="240" r="6" fill="#00E5FF" />

    <path d="M 50 310 L 105 310 L 145 285 L 170 285" fill="none" />
    <circle cx="50" cy="310" r="5" fill="#00E5FF" />

    <path d="M 80 130 L 130 160 L 150 160 L 175 190" fill="none" />
    <circle cx="80" cy="130" r="4" fill="#00E5FF" />

    <path d="M 75 380 L 125 350 L 155 350 L 175 320" fill="none" />
    <circle cx="75" cy="380" r="4" fill="#00E5FF" />
    
    <!-- Cross circuit nodes -->
    <path d="M 120 210 L 120 230" fill="none" />
    <circle cx="120" cy="230" r="3" fill="#00BCD4" />
    <path d="M 105 310 L 105 330" fill="none" />
    <circle cx="105" cy="330" r="3" fill="#00BCD4" />
  </g>

  <!-- Circuit traces right -->
  <g stroke="#00BCD4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" filter="url(#glow)">
    <path d="M 452 180 L 402 180 L 372 210 L 342 210" fill="none" />
    <circle cx="452" cy="180" r="5" fill="#00E5FF" />

    <path d="M 472 240 L 417 240 L 377 256 L 347 256" fill="none" />
    <circle cx="472" cy="240" r="6" fill="#00E5FF" />

    <path d="M 462 310 L 407 310 L 367 285 L 342 285" fill="none" />
    <circle cx="462" cy="310" r="5" fill="#00E5FF" />

    <path d="M 432 130 L 382 160 L 362 160 L 337 190" fill="none" />
    <circle cx="432" cy="130" r="4" fill="#00E5FF" />

    <path d="M 437 380 L 387 350 L 357 350 L 337 320" fill="none" />
    <circle cx="437" cy="380" r="4" fill="#00E5FF" />

    <!-- Cross circuit nodes -->
    <path d="M 392 210 L 392 230" fill="none" />
    <circle cx="392" cy="230" r="3" fill="#00BCD4" />
    <path d="M 407 310 L 407 330" fill="none" />
    <circle cx="407" cy="330" r="3" fill="#00BCD4" />
  </g>

  <!-- Top / Bottom circuits -->
  <g stroke="#00838F" stroke-width="2" opacity="0.6">
    <path d="M 210 110 L 210 150 L 230 170" fill="none" />
    <circle cx="210" cy="110" r="4" fill="#00BCD4" />
    <path d="M 302 110 L 302 150 L 282 170" fill="none" />
    <circle cx="302" cy="110" r="4" fill="#00BCD4" />

    <path d="M 210 402 L 210 362 L 230 342" fill="none" />
    <circle cx="210" cy="402" r="4" fill="#00BCD4" />
    <path d="M 302 402 L 302 362 L 282 342" fill="none" />
    <circle cx="302" cy="402" r="4" fill="#00BCD4" />
  </g>

  <!-- Central Chip Octagon / Card -->
  <polygon points="190,195 322,195 350,225 350,287 322,317 190,317 162,287 162,225"
    fill="#161B26" stroke="#00BCD4" stroke-width="3.5" filter="url(#glow)" />

  <!-- Inner highlight ring -->
  <polygon points="194,201 318,201 344,228 344,284 318,311 194,311 168,284 168,228"
    fill="none" stroke="#00E5FF" stroke-width="1" stroke-dasharray="6,4" opacity="0.6" />

  <!-- Candlestick chart mini glyph inside badge -->
  <g opacity="0.25">
    <line x1="205" y1="215" x2="205" y2="295" stroke="#00E676" stroke-width="2" />
    <rect x="200" y="235" width="10" height="35" rx="1" fill="#00E676" />

    <line x1="230" y1="220" x2="230" y2="290" stroke="#FF5252" stroke-width="2" />
    <rect x="225" y="240" width="10" height="25" rx="1" fill="#FF5252" />

    <line x1="280" y1="210" x2="280" y2="300" stroke="#00E676" stroke-width="2" />
    <rect x="275" y="225" width="10" height="40" rx="1" fill="#00E676" />

    <line x1="305" y1="225" x2="305" y2="285" stroke="#00E676" stroke-width="2" />
    <rect x="300" y="230" width="10" height="30" rx="1" fill="#00E676" />
  </g>

  <!-- Brand Typography -->
  <text x="210" y="265" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" letter-spacing="1">TRADE</text>
  <text x="312" y="265" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="34" fill="#00E5FF" letter-spacing="1">AI</text>

  <!-- Subtitle Indicator -->
  <circle cx="236" cy="287" r="3" fill="#00E676" />
  <text x="246" y="291" font-family="sans-serif" font-size="11" font-weight="700" fill="#80DEEA" letter-spacing="2">FOREX AI</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);

// Helper function to create a valid PNG file buffer with RGBA pixels
function createPngBuffer(width, height, getPixel) {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit bit depth
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(8 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    // CRC calculation
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeInt32BE(crc, 8 + len);
    return buf;
  }

  // Raw uncompressed raster scanlines: filter byte (0) + width * 4 bytes RGBA
  const rawScanlines = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawScanlines[offset++] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawScanlines[offset++] = r;
      rawScanlines[offset++] = g;
      rawScanlines[offset++] = b;
      rawScanlines[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawScanlines);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Table-based CRC32
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1);
}

const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

// Pixel generator for Trade AI icon
function getTradeAiPixel(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = 0.5;
  const dx = nx - cx;
  const dy = ny - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background dark gradient (#0a0f18 to #121824)
  let r = 16, g = 22, b = 34, a = 255;

  // Outer rounded border glow
  if (dist > 0.45 && dist < 0.49) {
    return [0, 188, 212, 230];
  }

  // Central chip box
  const inChipX = Math.abs(dx) < 0.28;
  const inChipY = Math.abs(dy) < 0.16;
  const onChipBorder = (Math.abs(Math.abs(dx) - 0.28) < 0.015 && inChipY) ||
                       (Math.abs(Math.abs(dy) - 0.16) < 0.015 && inChipX);

  if (onChipBorder) {
    return [0, 229, 255, 255]; // Bright cyan
  }

  if (inChipX && inChipY) {
    r = 24; g = 32; b = 48; // Inner dark badge
  }

  // Circuit horizontal traces
  const isTracesY = Math.abs(dy - 0.05) < 0.01 || Math.abs(dy + 0.05) < 0.01 || Math.abs(dy) < 0.01;
  if (!inChipX && isTracesY && Math.abs(dx) < 0.45) {
    return [0, 188, 212, 240];
  }

  // Green / Red candlestick highlights
  if (Math.abs(dx + 0.1) < 0.02 && Math.abs(dy) < 0.08) {
    return [0, 230, 118, 255]; // Green bar
  }
  if (Math.abs(dx - 0.1) < 0.02 && Math.abs(dy) < 0.07) {
    return [0, 229, 255, 255]; // Cyan bar
  }

  return [r, g, b, a];
}

// Generate PNG files
console.log('Generating PNG icons...');
const png192 = createPngBuffer(192, 192, getTradeAiPixel);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png192);

const png512 = createPngBuffer(512, 512, getTradeAiPixel);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), png512);

console.log('Generated icon.svg, pwa-192x192.png, pwa-512x512.png, apple-touch-icon.png successfully!');
