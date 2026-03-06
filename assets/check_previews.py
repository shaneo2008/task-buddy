from PIL import Image
import os

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"
characters = ["rex", "snapper", "snoozy", "masha", "hoppy", "stella", "flutty", 
              "sparky", "luna", "buddy", "finn", "zen"]

print("Current preview sizes:")
for char in characters:
    preview_path = os.path.join(base_dir, f"{char}-preview.png")
    if os.path.exists(preview_path):
        img = Image.open(preview_path)
        print(f"  {char}: {img.size}")
    else:
        print(f"  {char}: MISSING")
