from PIL import Image, ImageDraw
import sys
import os

# Paths
BASE_DIR = r"h:\My Drive\Stables\assets\current"
INPUT_FILE = os.path.join(BASE_DIR, "2_Lockup_Stables_current.png")
OUTPUT_FILE = os.path.join(BASE_DIR, "2_Lockup_Stables_current_fixed.png")

print(f"Opening {INPUT_FILE}...")
try:
    img = Image.open(INPUT_FILE).convert("RGBA")
except Exception as e:
    print(f"Error opening file: {e}")
    sys.exit(1)

width, height = img.size
print(f"Image size: {width}x{height}")

# Smart flood fill approach
# We assume the corners are background.
# We will flood fill from the top-left corner with a tolerance.
# Checkerboard usually has two colors. We might need multiple passes or a high tolerance logic.

# Actually, if it's a checkerboard, flood fill with 0 tolerance stops at the first check color change.
# We need to identifying the "Background" palette.
# Let's sample the corners.
corners = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
bg_samples = []
for x, y in corners:
    bg_samples.append(img.getpixel((x, y)))

print(f"Corner colors: {bg_samples}")

# Helper to check if a pixel is "background-like" (white, grey, transparent representation)
# Adjust thresholds as needed. Checkerboard light (255,255,255) and dark (204,204,204) often.
def is_bg(r, g, b, a):
    if a == 0: return True # Already transparent
    # Check for white/grey scale
    if abs(r-g) < 10 and abs(g-b) < 10: # It's grey-ish
        if r > 200: # Light grey to white
            return True
    return False

# Since floodfill in PIL is specific to a single color, we can do a different approach:
# Create a mask by iterating pixels. If pixel connects to the outside and is "bg-color", clear it.
# This assumes the logo is *surrounded* by background and doesn't touch edges significantly.

# Simple logic for now: Replace white and light-grey (common checkerboard) with transparent.
# This works if the logo doesn't have pure white/light-grey on the edges.
# Metallic logos usually have gradients, so we must be careful not to eat into highlights.
# The safest is flood fill from outside.

# Manual flood fill with deque
from collections import deque

mask = Image.new('L', (width, height), 0) # 0 = keep, 1 = transparent
visited = set()
queue = deque()

# Start from corners
for x, y in corners:
    if (x, y) not in visited:
        queue.append((x, y))
        visited.add((x, y))

# Get top-left color as reference "bg"
ref_bg = img.getpixel((0,0))

# Tolerance for flood fill color matching
TOLERANCE = 40 

def color_match(c1, c2):
    return abs(c1[0]-c2[0]) < TOLERANCE and \
           abs(c1[1]-c2[1]) < TOLERANCE and \
           abs(c1[2]-c2[2]) < TOLERANCE

# If the corners are vastly different (checkerboard squares), we need to handle that.
# Let's just blindly assume "anything connecting to edge that is white/greyish is BG".

pixels = img.load()

# Queue expansion logic
while queue:
    x, y = queue.popleft()
    current_color = pixels[x, y]
    
    # Check if this pixel is "removable background"
    # Logic: close to white or light grey
    r, g, b, a = current_color
    
    is_removable = False
    if a > 0:
        # Check against reference BG (assumed corner) OR generally "light grey/white"
        # Since checkerboard alternates, we can't stick to one reference.
        # But both checker squares are usually neutral grey.
        if abs(r - g) < 20 and abs(g - b) < 20 and r > 180:
             is_removable = True
    
    if is_removable:
        mask.putpixel((x, y), 255) # Mark for removal
        
        # Add neighbors
        for nx, ny in [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]:
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    visited.add((nx, ny))
                    queue.append((nx, ny))

# Apply mask (inverted: 255 means transparent in our logic above, so we set alpha=0)
# Actually easy way: Iterate and set alpha.
for y in range(height):
    for x in range(width):
        if mask.getpixel((x, y)) == 255:
            r, g, b, a = pixels[x, y]
            pixels[x, y] = (r, g, b, 0)

print(f"Saving fixed image to {OUTPUT_FILE}...")
img.save(OUTPUT_FILE)
print("Done.")




