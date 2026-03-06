from PIL import Image
import os

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"
out_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\sprite_inspect"
os.makedirs(out_dir, exist_ok=True)

characters = ["rex", "snapper", "snoozy", "masha", "hoppy", "stella", "flutty", 
              "sparky", "luna", "buddy", "finn", "zen"]
anims = ["idle", "bored", "chomp", "celebrate"]

for char in characters:
    for anim in anims:
        path = os.path.join(base_dir, f"{char}-{anim}.png")
        if not os.path.exists(path):
            continue
        sheet = Image.open(path).convert("RGBA")
        
        # Detect frame count
        if sheet.width >= 1000:
            frame_count = 16
        else:
            frame_count = 4
        
        frame_w = sheet.width // frame_count
        
        # Save first 4 frames side by side as a strip for inspection
        frames_to_show = min(4, frame_count)
        strip = Image.new("RGBA", (frame_w * frames_to_show, sheet.height), (200, 200, 200, 255))
        for i in range(frames_to_show):
            frame = sheet.crop((i * frame_w, 0, (i+1) * frame_w, sheet.height))
            strip.paste(frame, (i * frame_w, 0), frame)
        
        # Scale up 3x for visibility
        strip_big = strip.resize((strip.width * 3, strip.height * 3), Image.Resampling.NEAREST)
        strip_big.save(os.path.join(out_dir, f"{char}-{anim}-frames.png"))

print(f"Saved to {out_dir}")
print("Check: do idle frames look like eating/chomping?")
