# Favicon Files

I've created SVG-based favicon files for your JustCases website based on your logo design.

## Files Created:
- `/public/favicon.svg` - Main favicon (all sizes, scalable)
- `/public/favicon-16x16.svg` - 16x16 favicon
- `/public/favicon-32x32.svg` - 32x32 favicon
- `/public/apple-touch-icon.svg` - Apple touch icon (180x180)
- `/public/icon-192x192.svg` - PWA icon (192x192)
- `/public/icon-512x512.svg` - PWA icon (512x512)

## To Replace with Your Actual Logo Image:

If you want to use your exact logo image instead of the SVG versions:

1. Save your logo image (the one you attached) as a high-resolution PNG
2. Use an online tool or software to convert it to different sizes:
   - Favicon Generator: https://realfavicongenerator.net/
   - Or use ImageMagick locally

3. Generate these files:
   - favicon.ico (16x16, 32x32, 48x48 multi-resolution)
   - favicon-16x16.png
   - favicon-32x32.png
   - apple-touch-icon.png (180x180)
   - icon-192x192.png (for PWA)
   - icon-512x512.png (for PWA)

4. Replace the SVG files with PNG files and update `app/layout.tsx` icon types from `image/svg+xml` to `image/png`

## Current Implementation:
The favicons are now configured and will appear in browser tabs. The SVG format ensures crisp display at any size and smaller file sizes.

## Testing:
1. Build and run your app: `npm run build && npm start`
2. Open your site and check the browser tab
3. Check mobile devices for the apple-touch-icon
4. Install as PWA to see the app icons

The icons use the JustCases brand colors (#00d4ff cyan/blue on dark background) with the phone case design and wave pattern from your logo.
