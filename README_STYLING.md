# Tailwind CSS Setup - Troubleshooting

If styles are not appearing in the browser:

## Quick Fixes:

1. **Hard Refresh Browser:**
   - Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **Clear Browser Cache:**
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

3. **Restart Dev Server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm start
   ```

## Verification:

1. Check if `styles.css` is loaded in DevTools Network tab
2. Inspect an element and verify Tailwind classes are applied
3. Check browser console for any CSS loading errors

## Configuration Files:

- `tailwind.config.js` - Tailwind configuration
- `postcss.config.cjs` - PostCSS configuration  
- `src/global_styles.css` - Contains Tailwind directives
- `angular.json` - References `src/global_styles.css` in styles array

All Tailwind classes should be working. If issues persist, check browser console for errors.

