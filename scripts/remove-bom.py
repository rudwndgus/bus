from pathlib import Path
for p in Path('.').rglob('*'):
 if any(x in p.parts for x in ['node_modules','.git','IMAGE','dist']):continue
 if p.is_file() and p.suffix in ['.json','.ts','.tsx','.js','.toml','.html','.svg','.webmanifest','.md','.py']:
  b=p.read_bytes()
  if b.startswith(b'\xef\xbb\xbf'):p.write_bytes(b[3:])
