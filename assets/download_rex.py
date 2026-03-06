import urllib.request
import zipfile
import os

# Download the character ZIP
character_id = "e836c8fe-b231-4455-a1dd-ca0c7df791b1"
url = f"https://api.pixellab.ai/mcp/characters/{character_id}/download"
zip_path = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\rex-improved.zip"
extract_path = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\rex-improved"

print(f"Downloading from {url}...")

# Create request with headers
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

with urllib.request.urlopen(req, timeout=30) as response:
    data = response.read()
    print(f"Status: {response.status}, Size: {len(data)} bytes")
    
    if len(data) > 1000:
        with open(zip_path, 'wb') as f:
            f.write(data)
        print(f"Saved to {zip_path}")
        
        # Extract
        os.makedirs(extract_path, exist_ok=True)
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_path)
        print(f"Extracted to {extract_path}")
        
        # List contents
        for root, dirs, files in os.walk(extract_path):
            level = root.replace(extract_path, '').count(os.sep)
            indent = ' ' * 2 * level
            print(f'{indent}{os.path.basename(root)}/')
            subindent = ' ' * 2 * (level + 1)
            for file in files[:10]:
                print(f'{subindent}{file}')
            if len(files) > 10:
                print(f'{subindent}... and {len(files) - 10} more files')
    else:
        print(f"File too small, might be an error: {data[:200]}")
