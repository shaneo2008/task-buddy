from PIL import Image
import os

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"
char = "hoppy"

idle_path = os.path.join(base_dir, f"{char}-idle.png")
preview_path = os.path.join(base_dir, f"{char}-preview.png")

sheet = Image.open(idle_path)
# 4 frames, 128px each
frame_width = sheet.width // 4
first_frame = sheet.crop((0, 0, frame_width, sheet.height))

# Aggressive upscale for better visual fill
preview = first_frame.resize((160, 160), Image.Resampling.NEAREST)
preview.save(preview_path)

print(f"Hoppy: 128px → 160x160")
