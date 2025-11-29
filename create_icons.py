#!/usr/bin/env python3
"""
Simple script to generate PNG icons for the PWA.
Requires Pillow: pip install pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Error: Pillow is not installed.")
    print("Install it with: pip install pillow")
    exit(1)

def create_icon(size):
    # Create image with gradient-like background
    img = Image.new('RGB', (size, size), '#667eea')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple Connect 4 grid representation
    cell_size = size // 8
    offset = cell_size
    
    # Draw blue background for grid
    grid_rect = [offset, offset * 1.5, size - offset, size - offset * 1.5]
    draw.rectangle(grid_rect, fill='#2563eb')
    
    # Draw some circles to represent pieces
    circle_radius = cell_size // 3
    colors = ['#fbbf24', '#ef4444', '#1e40af']  # Yellow, Red, Empty
    
    for row in range(6):
        for col in range(7):
            x = offset + (col + 0.5) * cell_size
            y = offset * 1.5 + (row + 0.5) * cell_size
            
            # Create a pattern
            if row < 3 and col < 4:
                color = colors[0] if (row + col) % 2 == 0 else colors[1]
            else:
                color = colors[2]
            
            draw.ellipse(
                [x - circle_radius, y - circle_radius, 
                 x + circle_radius, y + circle_radius],
                fill=color
            )
    
    # Draw "blind" eye symbol
    eye_y = size - offset * 2
    eye_x = size // 2
    eye_width = size // 4
    eye_height = size // 8
    
    # Eye shape
    draw.ellipse(
        [eye_x - eye_width, eye_y - eye_height,
         eye_x + eye_width, eye_y + eye_height],
        fill='white'
    )
    
    # Pupil
    pupil_radius = size // 20
    draw.ellipse(
        [eye_x - pupil_radius, eye_y - pupil_radius,
         eye_x + pupil_radius, eye_y + pupil_radius],
        fill='#667eea'
    )
    
    # Slash through eye
    draw.line(
        [eye_x - eye_width, eye_y - eye_height,
         eye_x + eye_width, eye_y + eye_height],
        fill='#ef4444',
        width=max(3, size // 60)
    )
    
    return img

# Generate both icon sizes
print("Generating 192x192 icon...")
icon_192 = create_icon(192)
icon_192.save('icon-192.png')
print("[OK] Created icon-192.png")

print("Generating 512x512 icon...")
icon_512 = create_icon(512)
icon_512.save('icon-512.png')
print("[OK] Created icon-512.png")

print("\n[SUCCESS] Icons generated successfully!")
print("The app is now ready to use.")

