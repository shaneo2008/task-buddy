from PIL import Image
import os

characters = ["rex", "snapper", "snoozy", "masha", "hoppy", "stella", "zen", "sparky", "flutty", "luna", "buddy", "finn"]
output_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"

character_info = {
    "rex":     {"name": "Rex",     "trait": "Brave & Mighty"},
    "snapper": {"name": "Snapper", "trait": "Tough & Silly"},
    "snoozy":  {"name": "Snoozy",  "trait": "Cuddly & Calm"},
    "masha":   {"name": "Masha",   "trait": "Curious & Friendly"},
    "hoppy":   {"name": "Hoppy",   "trait": "Energetic & Bouncy"},
    "stella":  {"name": "Stella",  "trait": "Shiny & Sweet"},
    "zen":     {"name": "Zen",     "trait": "Calm & Wise"},
    "sparky":  {"name": "Sparky",  "trait": "Clever & Playful"},
    "flutty":  {"name": "Flutty",  "trait": "Gentle & Graceful"},
    "luna":    {"name": "Luna",    "trait": "Peaceful & Gentle"},
    "buddy":   {"name": "Buddy",   "trait": "Loyal & Friendly"},
    "finn":    {"name": "Finn",    "trait": "Cool & Adventurous"},
}

print("Creating static preview images...")

for char in characters:
    idle_path = os.path.join(output_dir, f"{char}-idle.png")
    preview_path = os.path.join(output_dir, f"{char}-preview.png")
    
    if not os.path.exists(idle_path):
        print(f"  ✗ {char}: idle sprite not found")
        continue
    
    # Open the sprite sheet and extract the first frame
    sheet = Image.open(idle_path)
    frame_width = sheet.width // 4  # All have 4 frames horizontally
    
    # Crop the first frame
    first_frame = sheet.crop((0, 0, frame_width, sheet.height))
    
    # Resize to 80x80 for preview (clean scaling)
    preview = first_frame.resize((80, 80), Image.Resampling.NEAREST)
    preview.save(preview_path)
    
    info = character_info[char]
    print(f"  ✓ {info['name']}: {info['trait']}")

print("\nDone! Preview images saved to public/")
