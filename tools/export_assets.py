"""Create web derivatives without modifying the dossier masters."""
import json
import shutil
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PACKAGE = ROOT / 'Portfolio_Campamento_Documentacion_y_Assets_v1'
KIT = PACKAGE / 'portfolio-campamento'
OUT = ROOT / 'public/assets'
OUT.mkdir(parents=True, exist_ok=True)
report = []


def export(source, name, size, trim=False):
    image = Image.open(source).convert('RGBA')
    if trim:
        image = image.crop(image.getbbox())
    image.thumbnail(size, Image.Resampling.LANCZOS)
    target = OUT / name
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, 'WEBP', quality=88, method=6)
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
        OUT / f"avatar/{frame['name']}.webp", 'WEBP', lossless=True)
    frames.append({k: frame[k] for k in ('name', 'w', 'h', 'anchorX', 'anchorY')})
(OUT / 'avatar/frames.json').write_text(json.dumps(frames), encoding='utf-8')
for name in ('Lexend-Variable.ttf', 'PixelifySans-Variable.ttf', 'Lexend-OFL.txt', 'PixelifySans-OFL.txt'):
    shutil.copy2(KIT / 'assets/fonts' / name, OUT / name)
for name in ('camp-ambience-loop.wav', 'ui-open.wav', 'step-soft.wav'):
    shutil.copy2(KIT / 'assets/audio' / name, OUT / name)
shutil.copy2(KIT / 'content/cv-alejo-palavecino-es.pdf', OUT / 'cv-alejo-palavecino-es.pdf')
(OUT / 'export-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps({'exports': len(report), 'image_bytes': sum(r['bytes'] for r in report)}))
