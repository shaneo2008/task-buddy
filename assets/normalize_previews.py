from PIL import Image
import os

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"
characters = ["rex", "snapper", "snoozy", "masha", "hoppy", "stella", "flutty", 
              "sparky", "luna", "buddy", "finn", "zen"]

TARGET = 128  # Final preview canvas size
PADDING = 8   # Pixels of padding around the cropped character

for char in characters:
    idle_path = os.path.join(base_dir, f"{char}-idle.png")
    preview_path = os.path.join(base_dir, f"{char}-preview.png")
    
    if not os.path.exists(idle_path):
        print(f"  ✗ {char}: not found")
        continue
    
    sheet = Image.open(idle_path).convert("RGBA")
    
    # Extract first frame
    if sheet.width >= 1000:  # 16 frames
        frame_width = sheet.width // 16
    else:                    # 4 frames
        frame_width = sheet.width // 4
    
    first_frame = sheet.crop((0, 0, frame_width, sheet.height))
    
    # Auto-crop to bounding box of non-transparent pixels
    bbox = first_frame.getbbox()
    if not bbox:
        print(f"  ✗ {char}: no visible pixels")
        continue
    
    cropped = first_frame.crop(bbox)
    
    # Scale up to fill TARGET minus padding on each side
    max_dim = TARGET - (PADDING * 2)
    scale = min(max_dim / cropped.width, max_dim / cropped.height)
    new_w = int(cropped.width * scale)
    new_h = int(cropped.height * scale)
    scaled = cropped.resize((new_w, new_h), Image.Resampling.NEAREST)
    
    # Paste centered on transparent canvas
    canvas = Image.new("RGBA", (TARGET, TARGET), (0, 0, 0, 0))
    x = (TARGET - new_w) // 2
    y = (TARGET - new_h) // 2
    canvas.paste(scaled, (x, y), scaled)
    
    canvas.save(preview_path)
    print(f"  ✓ {char}: cropped {bbox} → scaled {new_w}x{new_h} → centered on {TARGET}x{TARGET}")

print(f"\nAll previews auto-cropped and normalized to {TARGET}x{TARGET}")
