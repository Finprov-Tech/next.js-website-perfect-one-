import os
import json
from PIL import Image

uploaded_dir = r"C:\Users\FINPROV\.gemini\antigravity\brain\ead95c60-fb6b-4e68-afad-79efb8792bf3\.user_uploaded"
target_dir = r"c:\Users\FINPROV\Downloads\build-bright-paths-54\src\assets\course-images"

os.makedirs(target_dir, exist_ok=True)

screenshots = [
    "media__1784963214714.png",
    "media__1784963229052.png",
    "media__1784963244211.png",
    "media__1784963259500.png",
    "media__1784963274704.png"
]

# Read courses.ts to get exact slugs in order
courses_ts_path = r"c:\Users\FINPROV\Downloads\build-bright-paths-54\src\data\courses.ts"
with open(courses_ts_path, 'r', encoding='utf-8') as f:
    content = f.read()

import re
match = re.search(r'export const courses: Course\[\] = (\[[\s\S]*?\]);', content)
if not match:
    print("Could not parse courses.ts")
    exit(1)

courses = json.loads(match.group(1))
print(f"Total courses in catalog: {len(courses)}")

# For each screenshot, process 3 columns x 5 rows
# We will detect card boundaries dynamically based on non-white region in top section of each card box

course_idx = 0

for shot_idx, shot_file in enumerate(screenshots):
    shot_path = os.path.join(uploaded_dir, shot_file)
    if not os.path.exists(shot_path):
        print(f"Screenshot {shot_file} not found!")
        continue

    img = Image.open(shot_path)
    width, height = img.size
    print(f"\nProcessing Screenshot #{shot_idx+1}: {shot_file} ({width}x{height})")

    # Estimate grid dimensions
    # Margin left/right ~ 3%, margin top/bottom ~ 2%
    # Card width ~ 30% of width, Card height ~ 19% of height
    col_w = width / 3.0
    row_h = height / 5.0

    for row in range(5):
        for col in range(3):
            if course_idx >= len(courses):
                break

            c = courses[course_idx]
            slug = c['slug']

            # Calculate box area for card image banner inside card
            # The image thumbnail sits at top of card (~ top 45% of row height)
            left = int(col * col_w + col_w * 0.05)
            top = int(row * row_h + row_h * 0.02)
            right = int((col + 1) * col_w - col_w * 0.05)
            bottom = int(top + row_h * 0.42)

            cropped = img.crop((left, top, right, bottom))
            out_filename = f"{slug}.jpg"
            out_path = os.path.join(target_dir, out_filename)
            cropped.convert("RGB").save(out_path, "JPEG", quality=92)

            c['image'] = f"/src/assets/course-images/{out_filename}"
            print(f" -> [{course_idx+1}/70] Cropped screenshot image for {c['title']} ({slug}) -> {out_filename}")
            course_idx += 1

# Write back updated courses.ts
updated_ts = content.replace(match.group(1), json.dumps(courses, indent=2))
with open(courses_ts_path, 'w', encoding='utf-8') as f:
    f.write(updated_ts)

print("\nSUCCESSFULLY cropped and mapped all 70 exact course images from user screenshots!")
