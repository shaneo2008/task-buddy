from PIL import Image
import os

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\characters\zen\animations"
output_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"

# List all animation folders and their frame counts
print("Zen animation folders:")
for folder in os.listdir(base_dir):
    folder_path = os.path.join(base_dir, folder)
    if not os.path.isdir(folder_path):
        continue
    # Find south subfolder
    south = os.path.join(folder_path, "south")
    search_dir = south if os.path.exists(south) else folder_path
    frames = []
    for root, dirs, files in os.walk(search_dir):
        pngs = sorted([f for f in files if f.endswith('.png')])
        if pngs:
            frames = pngs
            break
    print(f"  [{len(frames)} frames] {folder}")

print()

# The "I need 4 frames" folder is a manually specified idle — use it
for folder in os.listdir(base_dir):
    if "I need 4 frames" in folder or "need 4 frames" in folder:
        folder_path = os.path.join(base_dir, folder)
        south = os.path.join(folder_path, "south")
        search_dir = south if os.path.exists(south) else folder_path
        
        frame_files = []
        for root, dirs, files in os.walk(search_dir):
            pngs = sorted([os.path.join(root, f) for f in files if f.endswith('.png')])
            if pngs:
                frame_files = pngs
                break
        
        if frame_files:
            frames = [Image.open(p) for p in frame_files]
            fw, fh = frames[0].width, frames[0].height
            sheet = Image.new('RGBA', (fw * len(frames), fh), (0,0,0,0))
            for i, f in enumerate(frames):
                sheet.paste(f, (i * fw, 0))
            out = os.path.join(output_dir, "zen-idle.png")
            sheet.save(out)
            print(f"Saved zen-idle from '{folder}': {len(frames)} frames @ {fw}x{fh}")
        else:
            print(f"No frames found in '{folder}'")
