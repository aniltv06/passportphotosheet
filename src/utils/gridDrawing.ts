/**
 * Grid Drawing Utility for Background Grids
 * Ported from oldWebsite/index.html:925-1084
 */

export function drawBackgroundGrid(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  dpi: number
): void {
  const marginSize = 0.25 * dpi; // 0.25 inch margin for measurements
  const gridInterval = 0.25 * dpi; // 0.25 inch grid (quarter inch)

  // Save context state
  ctx.save();

  // Draw very thin light gray grid lines in background
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.5;

  // Vertical grid lines
  for (let x = 0; x <= canvasWidth; x += gridInterval) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }

  // Horizontal grid lines
  for (let y = 0; y <= canvasHeight; y += gridInterval) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }

  // Reset alpha for measurement scales
  ctx.globalAlpha = 1.0;

  // Draw measurement scales on margins
  ctx.fillStyle = '#666666';
  ctx.strokeStyle = '#666666';
  ctx.lineWidth = 1;
  ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';

  // Top scale (horizontal measurements)
  for (let x = 0; x <= canvasWidth; x += dpi) {
    const inches = x / dpi;

    // Draw tick mark
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, marginSize * 0.5);
    ctx.stroke();

    // Draw label
    ctx.fillText(`${inches}"`, x, marginSize * 0.8);
  }

  // Left scale (vertical measurements)
  ctx.textAlign = 'right';
  for (let y = 0; y <= canvasHeight; y += dpi) {
    const inches = y / dpi;

    // Draw tick mark
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(marginSize * 0.5, y);
    ctx.stroke();

    // Draw label
    ctx.save();
    ctx.translate(marginSize * 0.9, y);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${inches}"`, 0, 0);
    ctx.restore();
  }

  // Right scale (vertical measurements)
  ctx.textAlign = 'left';
  for (let y = 0; y <= canvasHeight; y += dpi) {
    const inches = y / dpi;

    // Draw tick mark
    ctx.beginPath();
    ctx.moveTo(canvasWidth, y);
    ctx.lineTo(canvasWidth - marginSize * 0.5, y);
    ctx.stroke();

    // Draw label
    ctx.save();
    ctx.translate(canvasWidth - marginSize * 0.9, y);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${inches}"`, 0, 0);
    ctx.restore();
  }

  // Bottom scale (horizontal measurements)
  ctx.textAlign = 'center';
  for (let x = 0; x <= canvasWidth; x += dpi) {
    const inches = x / dpi;

    // Draw tick mark
    ctx.beginPath();
    ctx.moveTo(x, canvasHeight);
    ctx.lineTo(x, canvasHeight - marginSize * 0.5);
    ctx.stroke();

    // Draw label
    ctx.fillText(`${inches}"`, x, canvasHeight - marginSize * 0.2);
  }

  // Draw quarter-inch tick marks (smaller)
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.7;

  // Top quarter-inch ticks
  for (let x = 0; x <= canvasWidth; x += gridInterval) {
    if (x % dpi !== 0) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, marginSize * 0.3);
      ctx.stroke();
    }
  }

  // Bottom quarter-inch ticks
  for (let x = 0; x <= canvasWidth; x += gridInterval) {
    if (x % dpi !== 0) {
      ctx.beginPath();
      ctx.moveTo(x, canvasHeight);
      ctx.lineTo(x, canvasHeight - marginSize * 0.3);
      ctx.stroke();
    }
  }

  // Left quarter-inch ticks
  for (let y = 0; y <= canvasHeight; y += gridInterval) {
    if (y % dpi !== 0) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(marginSize * 0.3, y);
      ctx.stroke();
    }
  }

  // Right quarter-inch ticks
  for (let y = 0; y <= canvasHeight; y += gridInterval) {
    if (y % dpi !== 0) {
      ctx.beginPath();
      ctx.moveTo(canvasWidth, y);
      ctx.lineTo(canvasWidth - marginSize * 0.3, y);
      ctx.stroke();
    }
  }

  // Restore context state
  ctx.restore();

  // Ensure all states are reset to prevent artifacts
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.lineWidth = 1;
}
