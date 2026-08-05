with open('scratch/live_pgdifa_full.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

pos = html.lower().find('what does this course have to offer')
if pos != -1:
    print(f"Found at position {pos}")
    snippet = html[pos:pos+25000]
    with open('scratch/pgdifa_offer_snippet.html', 'w', encoding='utf-8') as sf:
        sf.write(snippet)
    print("Saved snippet to scratch/pgdifa_offer_snippet.html")
else:
    print("Not found")
