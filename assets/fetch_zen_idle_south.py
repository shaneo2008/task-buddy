"""
Fetch Zen's idle-sitting south frames directly from PixelLab URLs.
The animation has 10 frames. PixelLab stores frames as individual PNGs
accessible via the character's animation data.
"""
import urllib.request
import os
from PIL import Image
import io

# The idle-sitting animation south frames are stored at predictable URLs
# based on the character and animation IDs visible in get_character output
char_id = "d97ddac5-736a-4c0a-846a-da747692062e"
output_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"
temp_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\zen_idle_frames"
os.makedirs(temp_dir, exist_ok=True)

# Try fetching from the PixelLab backblaze storage directly
# Pattern: /file/pixellab-characters/{user_id}/{char_id}/animations/{anim_name}/south/{frame}.png
user_id = "cc94cdf6-f256-434c-b69d-95bb8a468cb6"
base_url = f"https://backblaze.pixellab.ai/file/pixellab-characters/{user_id}/{char_id}/animations"

# Try idle-sitting animation
anim_names = ["zen-idle-proper", "idle-sitting"]
headers = {"User-Agent": "Mozilla/5.0"}

for anim_name in anim_names:
    print(f"\nTrying animation: {anim_name}")
    frames = []
    for i in range(1, 20):  # Try up to 20 frames
        frame_num = str(i).zfill(4)
        url = f"{base_url}/{anim_name}/south/frame{frame_num}.png"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as r:
                data = r.read()
            img = Image.open(io.BytesIO(data))
            frames.append(img)
            print(f"  ✓ frame {i}: {img.size}")
        except Exception as e:
            if i == 1:
                print(f"  ✗ frame {i}: {e}")
            else:
                print(f"  Got {len(frames)} frames total")
            break
    
    if frames:
        fw, fh = frames[0].width, frames[0].height
        sheet = Image.new("RGBA", (fw * len(frames), fh), (0,0,0,0))
        for i, f in enumerate(frames):
            sheet.paste(f, (i * fw, 0))
        out = os.path.join(output_dir, "zen-idle.png")
        sheet.save(out)
        print(f"Saved zen-idle.png: {len(frames)} frames @ {fw}x{fh}")
        break
