import type { InterestTileData } from "@/lib/interests";
import { INTEREST_TILES } from "@/lib/interests";

export type MoodBoardPlacement = {
  x: number;
  y: number;
  /** degrees — slight tilt for collage feel */
  rotate: number;
  zIndex: number;
};

/** Packed collage layout in source pixels; scaled to fit viewport in InterestMoodBoard */
export const MOOD_BOARD_PLACEMENTS: Record<string, MoodBoardPlacement> = {
  marathon: { x: 0, y: 0, rotate: -1.5, zIndex: 2 },
  founders: { x: 995, y: 0, rotate: 1.2, zIndex: 3 },
  soccer: { x: 1468, y: 0, rotate: -0.8, zIndex: 4 },
  girlfriend: { x: 2116, y: 0, rotate: 2, zIndex: 5 },
  vietnam: { x: 0, y: 1024, rotate: 0.6, zIndex: 1 },
  friends: { x: 2048, y: 1024, rotate: 1.4, zIndex: 7 },
  "case-comp": { x: 2048, y: 1494, rotate: -2.2, zIndex: 8 },
  startup: { x: 1024, y: 1024, rotate: -1.8, zIndex: 6 },
  space: { x: 0, y: 1792, rotate: 1, zIndex: 9 },
};

export const MOOD_BOARD_WIDTH = 2884;
export const MOOD_BOARD_HEIGHT = 2108;

export type MoodBoardTile = InterestTileData & MoodBoardPlacement;

export const MOOD_BOARD_TILES: MoodBoardTile[] = INTEREST_TILES.map((tile) => {
  const placement = MOOD_BOARD_PLACEMENTS[tile.id];
  if (!placement) {
    throw new Error(`Missing mood board placement for ${tile.id}`);
  }
  return { ...tile, ...placement };
});
