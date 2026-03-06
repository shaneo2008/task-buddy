import urllib.request
import zipfile
import os
import socket

# Set longer timeouts
socket.setdefaulttimeout(120)

character_id = "e836c8fe-b231-4455-a1dd-ca0c7df791b1"
url = f"https://api.pixellab.ai/mcp/characters/{character_id}/download"
zip_path = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\rex-improved.zip"
extract_path = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\rex-improved"

print(f"Downloading...")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

try:
    with urllib.request.urlopen(req, timeout=120) as response:
        data = response.read()
        print(f"Downloaded: {len(data)} bytes")
        
        if len(data) > 1000:
            with open(zip_path, 'wb') as f:
                f.write(data)
            print(f"Saved")
            
            os.makedirs(extract_path, exist_ok=True)
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_path)
            print(f"Extracted to: {extract_path}")
            
            # Show structure
            for root, dirs, files in os.walk(extract_path):
                level = root.replace(extract_path, '').count(os.sep)
                indent = ' ' * 2 * level
                if level <= 2:  # Only show top levels
                    print(f'{indent}{os.path.basename(root)}/')
        else:
            print(f"Error response: {data[:500]}")
except Exception as e:
    print(f"Error: {e}")
