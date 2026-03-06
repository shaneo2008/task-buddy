from PIL import Image
import os

# Fix previews for 16-frame characters (64px frames)
small_chars = ["sparky", "luna", "buddy", "finn", "zen"]
base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"

for char in small_chars:
    idle_path = os.path.join(base_dir, f"{char}-idle.png")
    preview_path = os.path.join(base_dir, f"{char}-preview.png")
    
    if not os.path.exists(idle_path):
        print(f"  ✗ {char}: idle not found")
        continue
    
    sheet = Image.open(idle_path)
    # These have 16 frames horizontally
    frame_width = sheet.width // 16
    
    # Crop first frame only
    first_frame = sheet.crop((0, 0, frame_width, sheet.height))
    
    # Resize to 80x80
    preview = first_frame.resize((80, 80), Image.Resampling.NEAREST)
    preview.save(preview_path)
    
    print(f"  ✓ {char}: {frame_width}px frame → 80x80 preview")

print("\nDone!")
