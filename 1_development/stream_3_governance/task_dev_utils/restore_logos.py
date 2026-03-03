import os

# Source Base64
b64_path = r"C:\Users\Charles\.gemini\antigravity\scratch\Stables\logo_base64.txt"
with open(b64_path, "r", encoding="utf-8") as f:
    b64 = f.read().strip()

print(f"Loaded Base64 length: {len(b64)}")
logo_data = f"data:image/png;base64,{b64}"

# Files to patch
files = [
    (r"C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html", "Stables"),
    (r"C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html", "Stables Logo"),
    (r"C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\prod_capital_flows_infographic\index.html", "Stables")
]

for path, alt in files:
    if not os.path.exists(path):
        print(f"Error: {path} not found.")
        continue
        
    print(f"Patching {path}...")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    lines = content.splitlines()
    new_lines = []
    found = False
    for line in lines:
        if '<img src="data:image/png;base64,' in line:
            indent = line.split('<img')[0]
            new_lines.append(f'{indent}<img src="{logo_data}" alt="{alt}">')
            found = True
        else:
            new_lines.append(line)
    
    if not found:
        print(f"  Warning: Logo tag not found in {path}")
    else:
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(new_lines) + "\n")
        print(f"  Successfully patched {path}")

print("All tasks complete.")
