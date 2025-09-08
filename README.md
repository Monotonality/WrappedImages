# Interactive Wrapping Paper Tear

A fun, interactive web experience where users can tear away wrapping paper to reveal a hidden gift image underneath, just like a digital scratch card!

## Features

- **Interactive Canvas**: HTML5 canvas-based wrapping paper tearing effect
- **Cross-Platform**: Works on both desktop (mouse) and mobile (touch) devices
- **Responsive Design**: Adapts to different screen sizes
- **Auto-Reveal**: Automatically fades out remaining wrapping when 70% is cleared
- **Customizable**: Easy to change the hidden gift image
- **Modern UI**: Beautiful gradient background and smooth animations

## How It Works

1. The screen displays a colorful wrapping paper pattern over a hidden gift image
2. Users can click and drag (or touch and drag on mobile) to "tear away" the wrapping paper
3. The torn areas reveal the gift image underneath
4. When 70% of the wrapping paper is cleared, the remaining paper automatically fades out
5. The full gift image is revealed

## Files

- `index.html` - Main HTML structure
- `style.css` - Responsive CSS styling and animations
- `script.js` - Canvas-based tearing effect and interaction logic
- `gift.jpg` - The hidden gift image (customizable)
- `LICENSE` - MIT License

## Usage

1. Open `index.html` in a web browser
2. Click and drag to tear away the wrapping paper
3. Watch as the gift image is revealed underneath!

## Customization

### Changing the Gift Image
Replace `gift.jpg` with your own image file, or modify the `src` attribute in `index.html`:

```html
<img id="gift-image" src="your-image.jpg" alt="Your Gift" />
```

### Modifying the Wrapping Paper Pattern
The wrapping paper pattern is generated programmatically in `script.js`. You can customize:
- Colors in the `addWrappingPattern()` method
- Pattern size and complexity
- Sparkle effects

### Adjusting the Auto-Reveal Threshold
Change the percentage threshold in `script.js`:

```javascript
if (this.erasedPercentage >= 70 && !this.canvas.classList.contains('fade-out')) {
    this.autoReveal();
}
```

## Browser Compatibility

- Modern browsers with HTML5 Canvas support
- Mobile browsers with touch event support
- Tested on Chrome, Firefox, Safari, and Edge

## Technical Details

- **Canvas API**: Uses HTML5 Canvas for the tearing effect
- **Composite Operations**: Uses `destination-out` to create the erasing effect
- **Touch Events**: Handles both mouse and touch interactions
- **Responsive**: Canvas automatically resizes to match container
- **Performance**: Optimized for smooth 60fps interactions

## License

MIT License - see LICENSE file for details.
