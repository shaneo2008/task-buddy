from PIL import Image
import os

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"

# Large characters: 128px frames, resize to 80x80
large_chars = ["rex", "snapper", "snoozy", "masha", "hoppy", "stella", "flutty"]
# Small characters: 64px frames, upsample to match visual size
small_chars = ["sparky", "luna", "buddy", "finn", "zen"]

def process_preview(char, is_small):
    idle_path = os.path.join(base_dir, f"{char}-idle.png")
    preview_path = os.path.join(base_dir, f"{char}-preview.png")
    
    if not os.path.exists(idle_path):
        print(f"  ✗ {char}: not found")
        return
    
    sheet = Image.open(idle_path)
    
    if is_small:
        # 16 frames, extract first and upscale more for visual parity
        frame_width = sheet.width // 16
        first_frame = sheet.crop((0, 0, frame_width, sheet.height))
        # Upscale small characters more (64px → 120x120 for visual parity with 128px→80)
        preview = first_frame.resize((120, 120), Image.Resampling.NEAREST)
    else:
        # 4 frames, extract first
        frame_width = sheet.width // 4
        first_frame = sheet.crop((0, 0, frame_width, sheet.height))
        # Downscale large characters
        preview = first_frame.resize((80, 80), Image.Resampling.NEAREST)
    
    preview.save(preview_path)
    print(f"  ✓ {char}: {frame_width}px → {preview.size[0]}x{preview.size[1]}")

print("Processing large characters (128px frames → 80x80):")
for char in large_chars:
    process_preview(char, is_small=False)

print("\nProcessing small characters (64px frames → 120x120):")
for char in small_chars:
    process_preview(char, is_small=True)

print("\nDone!")
