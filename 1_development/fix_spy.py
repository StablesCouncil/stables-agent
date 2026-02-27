
import re

file_path = r"C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\Stables - Presentation v01.html"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern: <div class="pillar-icon"> followed by content that does NOT start with &
# This targets the one remaining raw emoji
pattern = r'(<div class="pillar-icon">)([^&<][^<]*)(</div>)'

def replacer(match):
    print(f"Found match: {match.group(2)}")
    return f'{match.group(1)}&#128373;{match.group(3)}'

new_content, count = re.subn(pattern, replacer, content)

if count > 0:
    print(f"Replaced {count} instances.")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    print("No matches found.")
