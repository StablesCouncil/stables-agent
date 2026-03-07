
import os

file_path = r"H:\My Drive\Stables\assets\Stables - Presentation EN-FR v01.html"

# The specific strings to fix (as they appear in the file content read previously)
# We use byte strings to avoid encoding ambiguity or open with utf-8
replacements = [
    ("qu\\'un", "qu'un"),
    ("l\\'écosystème", "l'écosystème"), # Note: Python strings might need care if file has entities
    ("l\\'avenir", "l'avenir"),
    # Add the entity versions found in grep/view_file
    ("qu\\'un message", "qu'un message"),
    ("l\\'avenir ?", "l'avenir ?"),
    (r"l\'&eacute;cosyst&egrave;me", r"l'&eacute;cosyst&egrave;me")
]

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

original_content = content

# Perform replacements
content = content.replace("qu\\'un", "qu'un")
content = content.replace("l\\'avenir", "l'avenir")
# The entity version found in view_file: l\'&eacute;cosyst&egrave;me
content = content.replace(r"l\'&eacute;cosyst&egrave;me", r"l'&eacute;cosyst&egrave;me")

if content != original_content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Corrections applied successfully.")
else:
    print("No changes needed or strings not found.")




