"""
Fetch Zen idle-sitting frames using the PixelLab MCP API endpoint directly.
The animation south frames are accessible via the MCP characters API.
"""
import urllib.request
import os
import json
from PIL import Image
import io

char_id = "d97ddac5-736a-4c0a-846a-da747692062e"
output_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"

# Try the MCP character frames endpoint
# Based on the backblaze URL pattern from rotation images:
# https://backblaze.pixellab.ai/file/pixellab-characters/{user}/{char}/rotations/south.png
# Animations are likely at:
# https://backblaze.pixellab.ai/file/pixellab-characters/{user}/{char}/animations/{anim_id}/south/{frame}.png

user_id = "cc94cdf6-f256-434c-b69d-95bb8a468cb6"
base = f"https://backblaze.pixellab.ai/file/pixellab-characters/{user_id}/{char_id}"
headers = {"User-Agent": "Mozilla/5.0"}

# Try various frame naming patterns for idle-sitting south
patterns = [
    f"{base}/animations/idle-sitting/south/frame_{{i:04d}}.png",
    f"{base}/animations/idle-sitting/south/{{i:04d}}.png",
    f"{base}/animations/idle-sitting/south/frame{{i}}.png",
    f"{base}/animations/idle-sitting/south/{{i}}.png",
]

for pattern in patterns:
    print(f"Trying pattern: {pattern.format(i=1)}")
    frames = []
    for i in range(1, 20):
        url = pattern.format(i=i)
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as r:
                data = r.read()
            img = Image.open(io.BytesIO(data))
            frames.append(img)
        except:
            break
    if frames:
        print(f"  Got {len(frames)} frames!")
        fw, fh = frames[0].width, frames[0].height
        sheet = Image.new("RGBA", (fw * len(frames), fh), (0,0,0,0))
        for i, f in enumerate(frames):
            sheet.paste(f, (i * fw, 0))
        out = os.path.join(output_dir, "zen-idle.png")
        sheet.save(out)
        print(f"  Saved zen-idle.png: {len(frames)} frames @ {fw}x{fh}")
        break
    else:
        print(f"  No frames found")
