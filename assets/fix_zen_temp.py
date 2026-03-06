"""
Temporary fix: use zen's custom-Idle (gentler eating pose) as idle,
and custom-I need 4 frames (more active eating) as chomp.
Will be replaced when idle-sitting ZIP becomes available.
"""
import shutil, os
from PIL import Image

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\characters\zen\animations"
output_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"

def make_sheet(folder_name):
    folder = os.path.join(base_dir, folder_name)
    south = os.path.join(folder, "south")
    search = south if os.path.exists(south) else folder
    files = []
    for root, dirs, f in os.walk(search):
        pngs = sorted([os.path.join(root, x) for x in f if x.endswith(".png")])
        if pngs:
            files = pngs
            break
    if not files:
        return None
    frames = [Image.open(p) for p in files]
    fw, fh = frames[0].width, frames[0].height
    sheet = Image.new("RGBA", (fw*len(frames), fh), (0,0,0,0))
    for i, f in enumerate(frames):
        sheet.paste(f, (i*fw, 0))
    return sheet, len(frames), fw, fh

# Map: use the "Idle_" folder (gentler) as idle sprite
# and the "I need 4 frames" folder (more active chomp) as chomp
mapping = {
    "zen-idle.png":  "custom-Idle_ _Sitting peacefully, slow breathing, gentle",
    "zen-chomp.png": "custom-I need 4 frames side-by-side. Frame 1_ Idle. Frame",
}

for out_file, folder_name in mapping.items():
    result = make_sheet(folder_name)
    if result:
        sheet, n, fw, fh = result
        sheet.save(os.path.join(output_dir, out_file))
        print(f"  ✓ {out_file}: {n} frames @ {fw}x{fh}")
    else:
        print(f"  ✗ {out_file}: no frames")

print("\nZen temporary fix applied.")
print("Replace zen-idle.png with idle-sitting once ZIP is available.")
