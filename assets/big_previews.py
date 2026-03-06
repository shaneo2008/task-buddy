from PIL import Image
import os

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"
characters = ["rex", "snapper", "snoozy", "masha", "hoppy", "stella", "flutty", 
              "sparky", "luna", "buddy", "finn", "zen"]

TARGET_SIZE = 200  # Go big

for char in characters:
    idle_path = os.path.join(base_dir, f"{char}-idle.png")
    preview_path = os.path.join(base_dir, f"{char}-preview.png")
    
    if not os.path.exists(idle_path):
        continue
    
    sheet = Image.open(idle_path)
    
    if sheet.width >= 1000:  # 16 frames
        frame_width = sheet.width // 16
    else:  # 4 frames
        frame_width = sheet.width // 4
    
    first_frame = sheet.crop((0, 0, frame_width, sheet.height))
    preview = first_frame.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.NEAREST)
    preview.save(preview_path)
    
    print(f"  ✓ {char}: {frame_width}px → {TARGET_SIZE}x{TARGET_SIZE}")

print(f"\nAll previews now {TARGET_SIZE}x{TARGET_SIZE}")
