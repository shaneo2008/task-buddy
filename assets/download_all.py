import urllib.request
import zipfile
import os
import socket

socket.setdefaulttimeout(180)  # 3 minutes

characters = {
    "rex": "e836c8fe-b231-4455-a1dd-ca0c7df791b1",
    "snapper": "d4e911d3-8207-45ed-b9bc-6d78336003c7",
    "snoozy": "5ebf94d5-7edb-4c25-935d-640f103af2c3",
    "masha": "4d6431eb-81aa-4f54-84b2-58d19b4bae8f",
    "hoppy": "49c30973-b267-408e-957a-a5d9ae269937",
    "stella": "ad816563-613b-4b30-99ed-02e657b8fe5a",
    "zen": "d97ddac5-736a-4c0a-846a-da747692062e",
    "sparky": "1fea5a72-5c5c-43ff-80e9-cf7d4d3d891b",
    "flutty": "66c96283-0c03-4132-bd26-56a70efaf6bb",
    "luna": "135d8718-50c4-4da3-b99b-5e083e9410c7",
    "buddy": "d5634330-e044-4a67-864a-eb6de565ebe7",
    "finn": "e9f00e9c-7209-4896-b1d3-a0d1f3f885ea"
}

base_dir = r"c:\Users\Michelle O Connor\CascadeProjects\Bedtime Buddy\assets\characters"
os.makedirs(base_dir, exist_ok=True)

for name, char_id in characters.items():
    zip_path = os.path.join(base_dir, f"{name}.zip")
    extract_path = os.path.join(base_dir, name)
    
    if os.path.exists(extract_path) and os.listdir(extract_path):
        print(f"✓ {name}: already downloaded")
        continue
    
    url = f"https://api.pixellab.ai/mcp/characters/{char_id}/download"
    print(f"Downloading {name}...")
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=180) as response:
            data = response.read()
            
            if len(data) > 1000:
                with open(zip_path, 'wb') as f:
                    f.write(data)
                
                os.makedirs(extract_path, exist_ok=True)
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_path)
                print(f"✓ {name}: {len(data)//1024}KB")
            else:
                print(f"✗ {name}: Error response")
    except Exception as e:
        print(f"✗ {name}: {e}")

print("\nDone!")
