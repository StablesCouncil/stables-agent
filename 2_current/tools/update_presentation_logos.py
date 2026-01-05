import base64
import re
import os

# Paths
BASE_DIR = r"h:\My Drive\Stablesworks"
ASSETS_DIR = os.path.join(BASE_DIR, "assets", "current")
HTML_FILE = os.path.join(ASSETS_DIR, "Stablesworks _ The Money Platform.html")
SYMBOL_IMG = os.path.join(ASSETS_DIR, "1_Symbol_current.png")
LOCKUP_IMG = os.path.join(ASSETS_DIR, "2_Lockup_Stables_current.png")

def get_base64_content(file_path):
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode('utf-8')

# Get new base64 strings
try:
    print(f"Reading symbol image: {SYMBOL_IMG}")
    symbol_b64 = get_base64_content(SYMBOL_IMG)
    print(f"Reading lockup image: {LOCKUP_IMG}")
    lockup_b64 = get_base64_content(LOCKUP_IMG)
except FileNotFoundError as e:
    print(f"Error reading images: {e}")
    # Consider checking alternative paths if absolute fails (e.g. relative to script)
    exit(1)

# Read HTML
try:
    print(f"Reading HTML file: {HTML_FILE}")
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html_content = f.read()
except FileNotFoundError as e:
    print(f"Error: HTML file not found: {e}")
    exit(1)

def update_tag(content, class_name, new_b64, label):
    # Search for an img tag containing the specific class
    # Helper to print snippets
    def snippet(s):
        return s[:50] + "..." if len(s) > 50 else s

    print(f"Searching for tag with class='{class_name}'...")
    # Regex finds <img ... class="hero-symbol" ... >
    # This handles attributes in any order.
    # [^>]* matches any char except > (greedy)
    tag_pattern = re.compile(f'<img[^>]*class="{class_name}"[^>]*>', re.IGNORECASE)
    match = tag_pattern.search(content)
    
    if match:
        tag_text = match.group(0)
        print(f"Found {label} tag starting with: {snippet(tag_text)}")
        
        # Regex to find src="data:image/..." inside this specific tag text
        # We look for exactly the structure we want to replace
        src_pattern = re.compile(r'src="data:image/[^;]+;base64,[^"]+"')
        
        if src_pattern.search(tag_text):
            new_src = f'src="data:image/png;base64,{new_b64}"'
            new_tag_text = src_pattern.sub(new_src, tag_text)
            
            # Use string replace on the full content.
            # Since the tag_text contains the old huge base64, it's virtually guaranteed to be unique.
            if tag_text in content:
                new_content = content.replace(tag_text, new_tag_text)
                print(f"Successfully replaced base64 data for {label}.")
                return new_content
            else:
                print(f"Error: Extracted tag text not found in content (unexpected).")
                return content
        else:
            print(f"Warning: Could not find 'src=\"data:image...\"' pattern in the {label} tag.")
            return content
    else:
        print(f"Warning: Could not find <img ... class=\"{class_name}\" ...> tag in the HTML.")
        return content

# Update Symbol
html_content = update_tag(html_content, "hero-symbol", symbol_b64, "Symbol")

# Update Lockup
html_content = update_tag(html_content, "hero-lockup", lockup_b64, "Lockup")

# Write back
try:
    print(f"Writing updated HTML to: {HTML_FILE}")
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("Write successful.")
except Exception as e:
    print(f"Error writing file: {e}")

print("Script completed.")



