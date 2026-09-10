import sys
import subprocess

try:
    from PIL import Image
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'Pillow'])
    from PIL import Image

img = Image.open('d:/cfc/logo.jpeg').convert('RGBA')
pixels = img.load()
width, height = img.size

# The background is mostly black. Logo is gold.
# Let's make pixels with low luminance transparent.
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        lum = 0.299*r + 0.587*g + 0.114*b
        if lum < 40:
            # smooth alpha transition to avoid jagged edges
            alpha = max(0, int((lum / 40.0) * 255))
            pixels[x, y] = (r, g, b, alpha)
        elif r < 50 and g < 50 and b < 50:
            pixels[x, y] = (r, g, b, 0)

img.save('d:/cfc/public/logo.png', 'PNG')
print('Logo background removed')
