import re
import urllib.request

req = urllib.request.Request(
    "https://finprov.com/how-to-crack-bank-exams-in-6-months/",
    headers={"User-Agent": "FinprovMigrationBot/1.0"},
)
page = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
links = re.findall(r'href="(https://finprov\.com/author/[^"]+)"', page, re.I)
print("author links:", links[:5])
