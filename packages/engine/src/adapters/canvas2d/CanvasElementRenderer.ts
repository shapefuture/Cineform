import type { AnimationElement } from '@cineform-forge/shared-types';

export function renderCanvasElement(
  ctx: CanvasRenderingContext2D,
  element: AnimationElement,
  state: Record<string, any>
): void {
  ctx.save();
  const {
    x = 0,
    y = 0,
    width = 50,
    height = 50,
    backgroundColor = '#222',
    opacity = 1,
    rotation = 0,
    scale = 1,
    text,
    fill = backgroundColor,
    borderRadius = 0,
  } = state;

  // Basic translate, rotate, scale
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  if (rotation) ctx.rotate((rotation * Math.PI) / 180);
  if (scale !== 1) ctx.scale(scale, scale);

  switch (element.type) {
    case 'shape':
      ctx.beginPath();
      // Rounded rectangle
      if (borderRadius > 0) {
        roundRect(ctx, 0, 0, width, height, borderRadius);
      } else {
        ctx.rect(0, 0, width, height);
      }
      ctx.fillStyle = fill || backgroundColor;
      ctx.fill();
      break;
    case 'text':
      ctx.fillStyle = fill || '#fff';
      ctx.font = state.font || '24px sans-serif';
      ctx.fillText(text || element.name, 0, height / 2);
      break;
    case 'image':
      if (state.src && state._img instanceof HTMLImageElement && state._img.complete) {
        ctx.drawImage(state._img, 0, 0, width, height);
      } else if (state.src && !state._img) {
        // load image
        const img = new window.Image();
        img.src = state.src;
        img.onload = () => {
          state._img = img;
        };
      }
      break;
    // TODO: handle group, audio, camera as needed
    default:
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.fillStyle = fill || backgroundColor;
      ctx.fill();
      break;
  }

  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}