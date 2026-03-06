from PIL import Image
import os

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\client\public"
characters = ["rex", "snapper", "snoozy", "masha", "hoppy", "stella", "flutty", 
              "sparky", "luna", "buddy", "finn", "zen"]

print("Comparing idle vs chomp (are they identical?):\n")
for char in characters:
    idle_path = os.path.join(base_dir, f"{char}-idle.png")
    chomp_path = os.path.join(base_dir, f"{char}-chomp.png")
    if not os.path.exists(idle_path) or not os.path.exists(chomp_path):
        print(f"  {char}: MISSING FILE")
        continue
    idle = Image.open(idle_path)
    chomp = Image.open(chomp_path)
    identical = (idle.size == chomp.size and list(idle.getdata()) == list(chomp.getdata()))
    print(f"  {char}: {'IDENTICAL ❌' if identical else 'DIFFERENT ✓'}")
