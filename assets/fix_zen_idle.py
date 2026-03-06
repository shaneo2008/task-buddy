from PIL import Image
import os

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\characters\zen\animations"
output_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"
inspect_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\sprite_inspect"

# Check all 4 folders and save inspection images
for folder in sorted(os.listdir(base_dir)):
    folder_path = os.path.join(base_dir, folder)
    if not os.path.isdir(folder_path):
        continue
    south = os.path.join(folder_path, "south")
    search_dir = south if os.path.exists(south) else folder_path
    
    frame_files = []
    for root, dirs, files in os.walk(search_dir):
        pngs = sorted([os.path.join(root, f) for f in files if f.endswith('.png')])
        if pngs:
            frame_files = pngs
            break
    
    if not frame_files:
        continue
    
    # Show first 4 frames
    frames = [Image.open(p) for p in frame_files[:4]]
    fw, fh = frames[0].width, frames[0].height
    strip = Image.new("RGBA", (fw * len(frames), fh), (200,200,200,255))
    for i, f in enumerate(frames):
        strip.paste(f, (i*fw, 0), f)
    strip_big = strip.resize((strip.width*3, strip.height*3), Image.Resampling.NEAREST)
    safe_name = folder[:50].replace("\\","-").replace("/","-").replace(":","-")
    strip_big.save(os.path.join(inspect_dir, f"zen-folder-{safe_name}.png"))
    print(f"  Saved: zen-folder-{safe_name}.png [{len(frame_files)} frames]")
