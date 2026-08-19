import re
import sys
import urllib.request
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

url = "https://finprov.com/advance-tax-meaning/"
html = urllib.request.urlopen(
    urllib.request.Request(url, headers={"User-Agent": "FinprovMigrationBot/1.0"}),
    timeout=45,
).read().decode("utf-8", errors="replace")

single_match = re.search(
    r'elementor-location-single(.*?)(?=elementor-location-footer|<footer)',
    html,
    re.I | re.S,
)
block = single_match.group(1) if single_match else html
widgets = Counter(re.findall(r'data-widget_type="([^"]+)"', block))
print("widgets in single:", widgets.most_common(20))

for wtype in ["theme-post-content.default", "text-editor.default", "html.default", "theme-post-excerpt.default"]:
    idx = block.find(f'data-widget_type="{wtype}"')
    if idx >= 0:
        chunk = block[idx : idx + 2000]
        container = re.search(r'elementor-widget-container">(.*)', chunk, re.S)
        print("\n===", wtype, "===")
        if container:
            print(container.group(1)[:500].replace("\n", " "))
