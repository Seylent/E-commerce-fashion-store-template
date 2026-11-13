const FRAME_WIDTH = 454;
const FRAME_HEIGHT = 956;
const CANVAS_GAP = 16;

export function getPreviewScale(width: number, height: number): number {
  return Math.max(
    0,
    Math.min(
      1,
      (width - CANVAS_GAP) / FRAME_WIDTH,
      (height - CANVAS_GAP) / FRAME_HEIGHT,
    ),
  );
}

export const PREVIEW_FRAME_SIZE = { width: FRAME_WIDTH, height: FRAME_HEIGHT };
