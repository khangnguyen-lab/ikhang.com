import type { Application } from "@splinetool/runtime";

/** Removes the "Built with Spline" badge from exported scenes */
export function hideSplineLogo(app: Application) {
  try {
    const renderer = (
      app as Application & {
        _renderer?: {
          pipeline?: {
            setWatermark: (texture: null) => void;
            logoOverlayPass?: { enabled: boolean };
          };
        };
      }
    )._renderer;

    if (renderer?.pipeline?.setWatermark) {
      renderer.pipeline.setWatermark(null);
      return;
    }

    if (renderer?.pipeline?.logoOverlayPass) {
      renderer.pipeline.logoOverlayPass.enabled = false;
    }
  } catch {
    // Non-fatal — scene still renders if watermark removal fails
  }
}
