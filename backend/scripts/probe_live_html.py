import re
import urllib.request

url = "https://finprov.com/advance-tax-meaning/"
html = urllib.request.urlopen(
    urllib.request.Request(url, headers={"User-Agent": "FinprovMigrationBot/1.0"}),
    timeout=45,
).read().decode("utf-8", errors="replace")

for pattern in [
    r'class="elementor-widget-theme-post-content[^"]*"[^>]*>(.*?)</div>\s*</div>\s*</div>',
    r'data-widget_type="theme-post-content\.default"[^>]*>.*?<div class="elementor-widget-container">(.*?)</div>\s*</div>',
    r'<div class="elementor-widget-container">\s*(<p>.*)',
]:
    m = re.search(pattern, html, re.I | re.S)
    print("pattern", pattern[:50], "->", len(m.group(1)) if m else 0)

# simpler: find theme-post-content widget container
idx = html.find('data-widget_type="theme-post-content.default"')
print("widget at", idx)
print(html[idx:idx+1500] if idx >= 0 else "none")
