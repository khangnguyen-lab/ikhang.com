# Spline 3D Globe

The [3D Globe](https://community.spline.design/file/dc934dad-135e-42bd-ad4d-8234b6cfd7bc) community file cannot load directly from code — you need to export it once.

## One-time setup (~2 min)

1. Open the [3D Globe on Spline Community](https://community.spline.design/file/dc934dad-135e-42bd-ad4d-8234b6cfd7bc)
2. Click **Remix** (free Spline account required)
3. In the editor: **Export → Code → Vanilla JS**
4. Click the **download** icon next to the scene URL to get `scene.splinecode`
5. Save it here as:

```
public/spline/globe.splinecode
```

6. Restart the dev server and hard-refresh the page.

Alternatively, paste your export URL in `.env.local`:

```
NEXT_PUBLIC_SPLINE_ABOUT_SCENE=https://prod.spline.design/YOUR-ID/scene.splinecode
```
