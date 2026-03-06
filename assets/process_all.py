from PIL import Image
import os
import glob

characters = ["rex", "snapper", "snoozy", "masha", "hoppy", "stella", "zen", "sparky", "flutty", "luna", "buddy", "finn"]
base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\characters"
output_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"

anim_keywords = {
    "chomp":     ["Chomp", "chomp", "Eat", "eating"],
    "idle":      ["Waiting", "Idle_", "Idle ", "custom-Idle"],
    "bored":     ["Getting bored", "Bored_", "Bored ", "custom-Bored", "falling asleep"],
    "celebrate": ["Happy Dance", "Happy dance", "Celebrate", "celebrate"],
}

# Animations that are NOT idle (to avoid false matches inside chomp folder names)
NON_IDLE_PREFIXES = ["custom-Chomp", "custom-Bored", "custom-Getting bored", "custom-Happy", "custom-Celebrate", "custom-I need"]

def find_animation_folder(anim_dir, keywords, exclude_prefixes=None):
    """Find folder matching any keyword, optionally excluding folders that start with certain prefixes."""
    if not os.path.exists(anim_dir):
        return None
    candidates = []
    for item in os.listdir(anim_dir):
        item_path = os.path.join(anim_dir, item)
        if not os.path.isdir(item_path):
            continue
        # Skip if folder starts with any exclusion prefix
        if exclude_prefixes:
            if any(item.lower().startswith(ep.lower()) for ep in exclude_prefixes):
                continue
        for kw in keywords:
            if kw.lower() in item.lower():
                candidates.append(item_path)
                break
    return candidates[0] if candidates else None

def create_spritesheet_from_dir(frames_dir, output_path):
    """Stitch all PNG frames into horizontal sprite sheet."""
    frame_files = []
    for root, dirs, files in os.walk(frames_dir):
        pngs = sorted([os.path.join(root, f) for f in files if f.endswith('.png')])
        if pngs:
            frame_files = pngs
            break

    if not frame_files:
        return None

    frames = [Image.open(p) for p in frame_files]
    frame_width = frames[0].width
    frame_height = frames[0].height
    total_width = frame_width * len(frames)

    spritesheet = Image.new('RGBA', (total_width, frame_height), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        spritesheet.paste(frame, (i * frame_width, 0))

    spritesheet.save(output_path)
    return len(frames), frame_width, frame_height

print("Processing all characters into sprite sheets...\n")

results = {}
for char in characters:
    print(f"{char}:")
    char_anim_dir = os.path.join(base_dir, char, "animations")
    
    if not os.path.exists(char_anim_dir):
        print(f"  No animations folder found")
        continue
    
    char_results = {}
    for anim_name, keywords in anim_keywords.items():
        # For idle, exclude folders that are actually chomp/bored/celebrate
        exclude = NON_IDLE_PREFIXES if anim_name == "idle" else None
        folder = find_animation_folder(char_anim_dir, keywords, exclude_prefixes=exclude)
        if folder:
            output_path = os.path.join(output_dir, f"{char}-{anim_name}.png")
            result = create_spritesheet_from_dir(folder, output_path)
            if result:
                n_frames, w, h = result
                print(f"  ✓ {anim_name}: {n_frames} frames @ {w}x{h}px")
                char_results[anim_name] = result
            else:
                print(f"  ✗ {anim_name}: no frames")
        else:
            print(f"  ✗ {anim_name}: folder not found")
    
    results[char] = char_results
    print()

# Summary
print("=" * 50)
print("SUMMARY:")
total = 0
for char, anims in results.items():
    n = len(anims)
    total += n
    status = "✓" if n == 4 else f"⚠ ({n}/4)"
    print(f"  {status} {char}: {list(anims.keys())}")

print(f"\nTotal: {total}/{len(characters)*4} sprite sheets created")
