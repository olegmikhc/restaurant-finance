"""Fingerprint browser assets so cached scripts cannot mismatch fresh HTML."""
from pathlib import Path
import hashlib
import re

root = Path(__file__).resolve().parent
assets = root / 'assets'
assets.mkdir(exist_ok=True)
html_path = root / 'index.html'
html = html_path.read_text()
for source, pattern in [
    ('app.js', r'(<script src=")[^"]+(" defer></script>)'),
    ('style.css', r'(<link rel="stylesheet" href=")[^"]+(">)'),
]:
    data = (root / source).read_bytes()
    digest = hashlib.sha256(data).hexdigest()[:12]
    filename = f'{Path(source).stem}.{digest}{Path(source).suffix}'
    (assets / filename).write_bytes(data)
    html, count = re.subn(pattern, lambda m: m[1] + 'assets/' + filename + m[2], html)
    assert count == 1, f'Expected one reference for {source}, got {count}'
    print(f'{source} -> assets/{filename}')
html_path.write_text(html)
