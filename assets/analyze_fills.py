from PIL import Image
import os

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"
characters = ["rex", "snapper", "snoozy", "masha", "hoppy", "stella", "flutty", 
              "sparky", "luna", "buddy", "finn", "zen"]

print("Analyzing character fills in idle frames...\n")

for char in characters:
    idle_path = os.path.join(base_dir, f"{char}-idle.png")
    if not os.path.exists(idle_path):
        continue
    
    sheet = Image.open(idle_path).convert("RGBA")
    
    if sheet.width >= 1000:
        frame_width = sheet.width // 16
    else:
        frame_width = sheet.width // 4
    
    first_frame = sheet.crop((0, 0, frame_width, sheet.height))
    
    # Find bounding box of non-transparent pixels
    bbox = first_frame.getbbox()
    if bbox:
        char_w = bbox[2] - bbox[0]
        char_h = bbox[3] - bbox[1]
        fill_pct = (char_w * char_h) / (frame_width * first_frame.height) * 100
        print(f"  {char}: frame={frame_width}x{first_frame.height}, char={char_w}x{char_h}, fill={fill_pct:.0f}%, bbox={bbox}")
    else:
        print(f"  {char}: NO visible pixels!")
