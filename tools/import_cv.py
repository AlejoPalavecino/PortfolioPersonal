"""Import an explicitly selected editorial CV, independently of graphics."""
import argparse
import hashlib
import shutil
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path, help='Approved PDF to use as the CV')
args = parser.parse_args()
source = args.source.resolve(strict=True)
if source.suffix.lower() != '.pdf' or not source.read_bytes().startswith(b'%PDF-'):
    parser.error('source must be a PDF document')
target = Path(__file__).resolve().parents[1] / 'public/assets/cv-alejo-palavecino-es.pdf'
if source != target:
    shutil.copy2(source, target)
print(f'CV imported: {target.name}; sha256={hashlib.sha256(target.read_bytes()).hexdigest()}')
