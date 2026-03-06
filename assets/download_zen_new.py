import urllib.request
import zipfile
import os
import shutil

url = "https://api.pixellab.ai/mcp/characters/d97ddac5-736a-4c0a-846a-da747692062e/download"
zip_path = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\zen_new.zip"
extract_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\zen_new"
output_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"

print("Downloading Zen new animations...")
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=120) as r:
    data = r.read()

print(f"Downloaded {len(data)} bytes")
with open(zip_path, "wb") as f:
    f.write(data)

# Extract
if os.path.exists(extract_dir):
    shutil.rmtree(extract_dir)
with zipfile.ZipFile(zip_path, "r") as z:
    z.extractall(extract_dir)

# Find the idle-sitting/south frames
print("\nLooking for idle-sitting south frames...")
from PIL import Image

for root, dirs, files in os.walk(extract_dir):
    if "idle-sitting" in root.lower() and "south" in root.lower():
        pngs = sorted([os.path.join(root, f) for f in files if f.endswith(".png")])
        if pngs:
            print(f"  Found {len(pngs)} frames in: {root}")
            frames = [Image.open(p) for p in pngs]
            fw, fh = frames[0].width, frames[0].height
            sheet = Image.new("RGBA", (fw * len(frames), fh), (0,0,0,0))
            for i, f in enumerate(frames):
                sheet.paste(f, (i * fw, 0))
            out = os.path.join(output_dir, "zen-idle.png")
            sheet.save(out)
            print(f"  Saved zen-idle.png: {len(frames)} frames @ {fw}x{fh}")
            break
else:
    print("Could not find idle-sitting/south — listing all folders:")
    for root, dirs, files in os.walk(extract_dir):
        pngs = [f for f in files if f.endswith(".png")]
        if pngs:
            print(f"  {len(pngs)} frames: {root}")
