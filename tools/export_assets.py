"""Create web derivatives without modifying the dossier masters."""
import json
import shutil
import subprocess
from pathlib import Path
from PIL import Image
from fontTools.ttLib.woff2 import compress

ROOT = Path(__file__).resolve().parents[1]
PACKAGE = ROOT / 'Portfolio_Campamento_Documentacion_y_Assets_v1'
KIT = PACKAGE / 'portfolio-campamento'
OUT = ROOT / 'public/assets'
OUT.mkdir(parents=True, exist_ok=True)
report = []


def export(source, name, size, trim=False, *, center_square=False, quality=88):
    image = Image.open(source).convert('RGBA')
    if trim:
        image = image.crop(image.getbbox())
    if center_square:
        left = (image.width - image.height) // 2
        image = image.crop((left, 0, left + image.height, image.height))
    image.thumbnail(size, Image.Resampling.LANCZOS)
    target = OUT / name
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, 'WEBP', quality=quality, method=6)
    report.append({'file': name, 'bytes': target.stat().st_size,
                   'width': image.width, 'height': image.height})


for name in ('world-backdrop', 'camp-ground', 'camp-foreground'):
    export(KIT / f'assets/world/{name}.png', f'{name}.webp', (1536, 1024))
for name in ('projects', 'about', 'journey', 'contact'):
    export(KIT / f'assets/destinations/poi-{name}.png',
           f'poi-{name}.webp', (720, 560), trim=True)
export(KIT / 'assets/character/alejo-portrait.png', 'portrait.webp', (480, 480), True)
export(PACKAGE / 'portfolio-campamento-handoff/assets/brand/camp-emblem-master.png',
       'emblem.webp', (160, 120), True)
export(KIT / 'assets/brand/favicon-master.png', 'favicon.webp', (64, 64), True)
export(KIT / 'assets/brand/portfolio-share-cover.png', 'share.webp', (1200, 675))
atlas_dir = KIT / 'assets/character'
metadata = json.loads((atlas_dir / 'avatar-movement-atlas.json').read_text())
atlas = Image.open(atlas_dir / 'avatar-movement-atlas.png')
(OUT / 'avatar').mkdir(exist_ok=True)
frames = []
for frame in metadata['frames']:
    x, y, w, h = (frame[k] for k in ('x', 'y', 'w', 'h'))
    atlas.crop((x, y, x + w, y + h)).save(
        OUT / f"avatar/{frame['name']}.webp", 'WEBP', quality=85, method=6)
    frames.append({k: frame[k] for k in ('name', 'w', 'h', 'anchorX', 'anchorY')})
(OUT / 'avatar/frames.json').write_text(json.dumps(frames), encoding='utf-8')
for stem in ('Lexend-Variable', 'PixelifySans-Variable'):
    compress(KIT / 'assets/fonts' / f'{stem}.ttf', OUT / f'{stem}.woff2')
for name in ('Lexend-OFL.txt', 'PixelifySans-OFL.txt'):
    shutil.copy2(KIT / 'assets/fonts' / name, OUT / name)
subprocess.run([
    'ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-i',
    str(KIT / 'assets/audio/camp-ambience-loop.wav'), '-map_metadata', '-1',
    '-codec:a', 'libmp3lame', '-b:a', '96k', str(OUT / 'camp-ambience-loop.mp3'),
], check=True)
for name in ('ui-open.wav', 'step-soft.wav'):
    shutil.copy2(KIT / 'assets/audio' / name, OUT / name)

# The current camp and interior illustrations live outside the historical dossier.
# Derive the phone art from the exact artwork used by the desktop scene.
export(OUT / 'camp-hillside.webp', 'compact/camp-hillside.webp', (1056, 704), quality=78)
export(OUT / 'world-backdrop.webp', 'compact/world-backdrop.webp', (960, 640), quality=78)
export(OUT / 'camp-rooms-v1/intro/mountain-arrival-clean.webp',
       'compact/arrival-center.webp', (768, 768), center_square=True, quality=78)
export(OUT / 'camp-rooms-v1/intro/mountain-arrival-clean.webp',
       'compact/arrival-wide.webp', (1008, 568), quality=78)
export(OUT / 'camp-rooms-v1/ui/adventure-button.webp', 'compact/adventure-button.webp', (648, 216), quality=78)
for name in ('projects', 'about', 'journey', 'contact'):
    export(OUT / f'camp-rooms-v2/{name}-portrait.webp', f'compact/{name}-portrait.webp', (736, 1104), quality=78)

# The professional CV has an independent editorial lifecycle. Graphics exports
# must never replace it with the historical dossier PDF. Use import_cv.py.
(OUT / 'export-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps({'exports': len(report), 'image_bytes': sum(r['bytes'] for r in report)}))
