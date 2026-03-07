from PIL import Image
import os

files = [
    r"c:\Users\Charles\.gemini\antigravity\scratch\Stables_v2\V2\Files\Stables_lockup.png",
    r"c:\Users\Charles\.gemini\antigravity\scratch\Stables_v2\V2\Files\SW_LOGO_Stables_S_v1_MASTER (1).png"
]

for f_path in files:
    if os.path.exists(f_path):
        try:
            img = Image.open(f_path)
            print(f"File: {os.path.basename(f_path)}")
            print(f"  Mode: {img.mode}")
            print(f"  Size: {img.size}")
            if img.mode == 'RGBA':
                extrema = img.getextrema()
                if extrema[3][0] < 255:
                    print("  Status: Has Transparency")
                else:
                    print("  Status: RGBA but opaque alpha channel")
            else:
                print("  Status: No Transparency (Opaque)")
        except Exception as e:
            print(f"Error reading {f_path}: {e}")
    else:
        print(f"File not found: {f_path}")




