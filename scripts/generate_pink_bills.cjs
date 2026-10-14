const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal pure Node.js RGBA PNG encoder
function encodePNG(width, height, rgbaBuffer) {
  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
    return Buffer.concat([len, t, data, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const rowSize = width * 4;
  const filtered = Buffer.alloc(height * (rowSize + 1));
  for (let y = 0; y < height; y++) {
    filtered[y * (rowSize + 1)] = 0; // filter byte 0
    rgbaBuffer.copy(filtered, y * (rowSize + 1) + 1, y * rowSize, (y + 1) * rowSize);
  }

  const idatData = zlib.deflateSync(filtered, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idatData), chunk('IEND', Buffer.alloc(0))]);
}

// Draw a realistic high-definition banknote with pink/coral brand tinting
function createBanknote(denomination, variant) {
  const W = 320;
  const H = 168;
  const buf = Buffer.alloc(W * H * 4);

  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const idx = (y * W + x) * 4;
    // Blend with existing if alpha < 255
    const srcA = a / 255;
    const dstA = buf[idx + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA > 0) {
      buf[idx] = Math.round((r * srcA + buf[idx] * dstA * (1 - srcA)) / outA);
      buf[idx + 1] = Math.round((g * srcA + buf[idx + 1] * dstA * (1 - srcA)) / outA);
      buf[idx + 2] = Math.round((b * srcA + buf[idx + 2] * dstA * (1 - srcA)) / outA);
      buf[idx + 3] = Math.round(outA * 255);
    }
  }

  function fillRect(x1, y1, w, h, r, g, b, a = 255) {
    for (let y = y1; y < y1 + h; y++) {
      for (let x = x1; x < x1 + w; x++) {
        setPixel(x, y, r, g, b, a);
      }
    }
  }

  function strokeRect(x1, y1, w, h, r, g, b, a = 255, strokeWidth = 1) {
    for (let sw = 0; sw < strokeWidth; sw++) {
      for (let x = x1 + sw; x < x1 + w - sw; x++) {
        setPixel(x, y1 + sw, r, g, b, a);
        setPixel(x, y1 + h - 1 - sw, r, g, b, a);
      }
      for (let y = y1 + sw; y < y1 + h - sw; y++) {
        setPixel(x1 + sw, y, r, g, b, a);
        setPixel(x1 + w - 1 - sw, y, r, g, b, a);
      }
    }
  }

  // Brand pink/coral and currency paper palette - High contrast & rich dark visibility:
  // Deep wine/crimson engraving ink (#400416, #881337, #be123c)
  const inkDarkR = 60, inkDarkG = 5, inkDarkB = 22;
  const inkMedR = 175, inkMedG = 12, inkMedB = 52;
  const inkLightR = 215, inkLightG = 35, inkLightB = 75;
  const paperBaseR = 244, paperBaseG = 196, paperBaseB = 210;

  // 1. Banknote paper body with rounded corners
  const radius = 10;
  for (let y = 4; y < H - 4; y++) {
    for (let x = 4; x < W - 4; x++) {
      let inside = true;
      if (x < 4 + radius && y < 4 + radius) {
        const dx = x - (4 + radius), dy = y - (4 + radius);
        if (dx * dx + dy * dy > radius * radius) inside = false;
      } else if (x >= W - 4 - radius && y < 4 + radius) {
        const dx = x - (W - 4 - radius), dy = y - (4 + radius);
        if (dx * dx + dy * dy > radius * radius) inside = false;
      } else if (x < 4 + radius && y >= H - 4 - radius) {
        const dx = x - (4 + radius), dy = y - (H - 4 - radius);
        if (dx * dx + dy * dy > radius * radius) inside = false;
      } else if (x >= W - 4 - radius && y >= H - 4 - radius) {
        const dx = x - (W - 4 - radius), dy = y - (H - 4 - radius);
        if (dx * dx + dy * dy > radius * radius) inside = false;
      }

      if (inside) {
        // Subtle paper texture & banknote gradient with rich visible tone
        const grad = 0.82 + 0.18 * Math.sin(x * 0.04) * Math.cos(y * 0.05);
        setPixel(x, y, Math.round(paperBaseR * grad), Math.round(paperBaseG * grad), Math.round(paperBaseB * grad), 255);
      }
    }
  }

  // 2. Multi-line intricate guilloché borders with deep contrast
  strokeRect(5, 5, W - 10, H - 10, inkDarkR, inkDarkG, inkDarkB, 255, 3);
  strokeRect(10, 10, W - 20, H - 20, inkMedR, inkMedG, inkMedB, 255, 2);
  strokeRect(15, 15, W - 30, H - 30, inkDarkR, inkDarkG, inkDarkB, 255, 2);

  // Micro lathe-work hatching around outer margin
  for (let x = 18; x < W - 18; x += 3) {
    setPixel(x, 8, inkDarkR, inkDarkG, inkDarkB, 255);
    setPixel(x, H - 9, inkDarkR, inkDarkG, inkDarkB, 255);
  }
  for (let y = 18; y < H - 18; y += 3) {
    setPixel(8, y, inkDarkR, inkDarkG, inkDarkB, 255);
    setPixel(W - 9, y, inkDarkR, inkDarkG, inkDarkB, 255);
  }

  // 3. Security 3D Hologram Ribbon (distinct deep pink/rose security strip)
  const ribbonX = variant === 1 ? 104 : 196;
  fillRect(ribbonX, 16, 18, H - 32, 225, 29, 72, 200);
  for (let y = 20; y < H - 20; y += 8) {
    fillRect(ribbonX + 2, y, 14, 3, 255, 255, 255, 230);
    fillRect(ribbonX + 4, y + 1, 10, 1, 180, 15, 55, 255);
  }

  // 4. Central Oval Engraved Portrait Frame
  const cx = W / 2;
  const cy = H / 2;
  const rx = 46;
  const ry = 42;

  // Concentric fine lathe ovals
  for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
    for (let dr = -2; dr <= 2; dr++) {
      const px = Math.round(cx + (rx + dr) * Math.cos(angle));
      const py = Math.round(cy + (ry + dr) * Math.sin(angle));
      setPixel(px, py, inkDarkR, inkDarkG, inkDarkB, dr === 0 ? 255 : 200);
    }
  }

  // Inner oval background with fine horizontal engraving lines
  for (let y = cy - ry + 4; y <= cy + ry - 4; y += 3) {
    const dy = (y - cy) / ry;
    const span = Math.sqrt(Math.max(0, 1 - dy * dy)) * rx * 0.92;
    for (let x = Math.round(cx - span); x <= Math.round(cx + span); x += 2) {
      setPixel(x, y, inkMedR, inkMedG, inkMedB, 180);
    }
  }

  // Presidential Silhouette / Vignette inside oval
  for (let y = cy - 28; y <= cy + 28; y++) {
    const dy = (y - cy) / 28;
    const headW = y < cy - 4 ? Math.max(0, 14 - Math.abs(y - (cy - 16)) * 0.8) : Math.max(0, 26 - Math.abs(y - cy) * 0.5);
    for (let x = Math.round(cx - headW * 0.7); x <= Math.round(cx + headW * 0.7); x++) {
      if ((x + y) % 2 === 0) {
        setPixel(x, y, inkDarkR, inkDarkG, inkDarkB, 255);
      }
    }
  }

  // 5. Official Heraldic Seal (left side)
  const sealX = variant === 1 ? 58 : 248;
  const sealY = H / 2;
  const sealR = 20;
  for (let a = 0; a < Math.PI * 2; a += 0.04) {
    const px = Math.round(sealX + sealR * Math.cos(a));
    const py = Math.round(sealY + sealR * Math.sin(a));
    setPixel(px, py, 225, 29, 72, 230);
  }
  // Starburst teeth
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    const px = Math.round(sealX + (sealR + 3) * Math.cos(a));
    const py = Math.round(sealY + (sealR + 3) * Math.sin(a));
    fillRect(px - 1, py - 1, 3, 3, 255, 77, 109, 240);
  }

  // 6. Treasury Crest (right side)
  const crestX = variant === 1 ? 246 : 64;
  const crestY = H / 2;
  strokeRect(crestX - 16, crestY - 16, 32, 32, inkDarkR, inkDarkG, inkDarkB, 180, 2);
  for (let d = -12; d <= 12; d += 4) {
    fillRect(crestX + d - 1, crestY + d - 1, 2, 2, 255, 77, 109, 220);
    fillRect(crestX - d - 1, crestY + d - 1, 2, 2, 255, 77, 109, 220);
  }

  // 7. Corner Denominations "$100" or "$50"
  // Block numbers in 4 corners
  function drawNumeral(bx, by) {
    // Ornate cartouche background
    fillRect(bx - 12, by - 8, 26, 18, 255, 255, 255, 180);
    strokeRect(bx - 12, by - 8, 26, 18, inkMedR, inkMedG, inkMedB, 220, 1);
    // Draw "100" glyph pattern
    if (denomination === '100') {
      // "1"
      fillRect(bx - 8, by - 5, 2, 12, inkDarkR, inkDarkG, inkDarkB, 255);
      // "0"
      strokeRect(bx - 3, by - 5, 6, 12, inkDarkR, inkDarkG, inkDarkB, 255, 1);
      // "0"
      strokeRect(bx + 5, by - 5, 6, 12, inkDarkR, inkDarkG, inkDarkB, 255, 1);
    } else {
      // "50"
      fillRect(bx - 7, by - 5, 7, 2, inkDarkR, inkDarkG, inkDarkB, 255);
      fillRect(bx - 7, by - 5, 2, 6, inkDarkR, inkDarkG, inkDarkB, 255);
      fillRect(bx - 7, by + 1, 7, 2, inkDarkR, inkDarkG, inkDarkB, 255);
      fillRect(bx - 2, by + 1, 2, 6, inkDarkR, inkDarkG, inkDarkB, 255);
      fillRect(bx - 7, by + 5, 7, 2, inkDarkR, inkDarkG, inkDarkB, 255);
      // "0"
      strokeRect(bx + 3, by - 5, 6, 12, inkDarkR, inkDarkG, inkDarkB, 255, 1);
    }
  }

  drawNumeral(34, 28);
  drawNumeral(W - 40, 28);
  drawNumeral(34, H - 32);
  drawNumeral(W - 40, H - 32);

  // 8. Top Banner: "UNITED STATES OF AMERICA" simulated microline
  fillRect(70, 24, W - 140, 4, inkDarkR, inkDarkG, inkDarkB, 230);
  for (let x = 74; x < W - 74; x += 3) {
    setPixel(x, 22, inkMedR, inkMedG, inkMedB, 180);
    setPixel(x, 29, inkMedR, inkMedG, inkMedB, 180);
  }

  // 9. Bottom Banner: "ONE HUNDRED DOLLARS" simulated microline
  fillRect(70, H - 30, W - 140, 4, inkDarkR, inkDarkG, inkDarkB, 230);
  for (let x = 74; x < W - 74; x += 3) {
    setPixel(x, H - 32, inkMedR, inkMedG, inkMedB, 180);
    setPixel(x, H - 25, inkMedR, inkMedG, inkMedB, 180);
  }

  // 10. Subtle glowing coral ambient perimeter
  for (let i = 0; i < 4; i++) {
    strokeRect(4 - i, 4 - i, W - 8 + i * 2, H - 8 + i * 2, 255, 77, 109, 35 - i * 8, 1);
  }

  return encodePNG(W, H, buf);
}

const outDir = path.join(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const bill1 = createBanknote('100', 1);
fs.writeFileSync(path.join(outDir, 'bill-1.png'), bill1);
console.log('Generated realistic pink-tinted bill-1.png (' + bill1.length + ' bytes)');

const bill2 = createBanknote('50', 2);
fs.writeFileSync(path.join(outDir, 'bill-2.png'), bill2);
console.log('Generated realistic pink-tinted bill-2.png (' + bill2.length + ' bytes)');
