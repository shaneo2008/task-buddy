from PIL import Image
import os
import glob

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\rex-improved\animations"
output_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"

def create_spritesheet_from_dir(frames_dir, output_path):
    """Find all PNG frames and stitch into horizontal sprite sheet."""
    frame_files = []
    for root, dirs, files in os.walk(frames_dir):
        pngs = sorted([os.path.join(root, f) for f in files if f.endswith('.png')])
        if pngs:
            frame_files = pngs
            break

    if not frame_files:
        print(f"  No frames found in: {frames_dir}")
        return None

    frames = [Image.open(p) for p in frame_files]
    frame_width = frames[0].width
    frame_height = frames[0].height
    total_width = frame_width * len(frames)

    spritesheet = Image.new('RGBA', (total_width, frame_height), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        spritesheet.paste(frame, (i * frame_width, 0))

    spritesheet.save(output_path)
    print(f"  Created: {os.path.basename(output_path)} ({len(frames)} frames, {frame_width}x{frame_height})")
    return len(frames), frame_width

# Map output name -> animation folder keyword
animations = {
    "rex-idle":      "custom-Waiting",
    "rex-chomp":     "custom-Chomp",
    "rex-bored":     "custom-Getting bored",
    "rex-celebrate": "custom-Happy Dance",
}

print("Building improved Rex sprite sheets...\n")
results = {}
for output_name, keyword in animations.items():
    matches = [d for d in os.listdir(base_dir) if keyword.lower() in d.lower()]
    if not matches:
        print(f"  Could not find folder for: {keyword}")
        continue
    anim_dir = os.path.join(base_dir, matches[0])
    output_path = os.path.join(output_dir, f"{output_name}.png")
    result = create_spritesheet_from_dir(anim_dir, output_path)
    if result:
        results[output_name] = result

print(f"\nDone: {len(results)}/{len(animations)} sprite sheets created.")
for name, (n_frames, w) in results.items():
    print(f"  {name}.png: {n_frames} frames, {w}px each = {n_frames * w}px total")
