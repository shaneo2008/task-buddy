from PIL import Image
import os

char = 'zen'
base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"
idle_path = os.path.join(base_dir, f"{char}-idle.png")
preview_path = os.path.join(base_dir, f"{char}-preview.png")

sheet = Image.open(idle_path)
frame_width = sheet.width // 16  # 16 frames for small characters
first_frame = sheet.crop((0, 0, frame_width, sheet.height))
preview = first_frame.resize((80, 80), Image.Resampling.NEAREST)
preview.save(preview_path)
print(f"Created {char}-preview.png")
