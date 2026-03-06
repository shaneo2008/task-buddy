from PIL import Image
import os
import sys

def create_spritesheet(frame_dir, output_path):
    """Combine all PNG frames in a directory into a horizontal sprite sheet."""
    frames = []
    frame_files = sorted([f for f in os.listdir(frame_dir) if f.endswith('.png')])
    
    for frame_file in frame_files:
        frame_path = os.path.join(frame_dir, frame_file)
        frames.append(Image.open(frame_path))
    
    if not frames:
        print(f"No frames found in {frame_dir}")
        return
    
    # Calculate sprite sheet dimensions
    frame_width = frames[0].width
    frame_height = frames[0].height
    total_width = frame_width * len(frames)
    total_height = frame_height
    
    # Create sprite sheet
    spritesheet = Image.new('RGBA', (total_width, total_height), (0, 0, 0, 0))
    
    for i, frame in enumerate(frames):
        spritesheet.paste(frame, (i * frame_width, 0))
    
    spritesheet.save(output_path)
    print(f"Created sprite sheet: {output_path} ({len(frames)} frames, {frame_width}x{frame_height} each)")

# Create idle sprite sheet
idle_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\rex\animations\breathing-idle\south"
idle_output = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\rex-idle.png"
create_spritesheet(idle_dir, idle_output)

# Create chomp sprite sheet  
chomp_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\rex\animations\cross-punch\south"
chomp_output = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\rex-chomp.png"
create_spritesheet(chomp_dir, chomp_output)

print("All sprite sheets created successfully!")
