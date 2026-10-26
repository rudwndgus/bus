import imageio_ffmpeg, subprocess, pathlib
ff=imageio_ffmpeg.get_ffmpeg_exe()
p=pathlib.Path('IMAGE/Video_20261026_100029_634.mp4')
r=subprocess.run([ff,'-i',str(p)],capture_output=True,text=True)
print(r.stderr)
subprocess.run([ff,'-y','-i',str(p),'-vf','fps=1/3,scale=240:-1','analysis/frames/sample-%03d.jpg'],capture_output=True)
from PIL import Image,ImageDraw
files=list(pathlib.Path('analysis/frames').glob('sample-*.jpg'))
for start in range(0,len(files),40):
 group=files[start:start+40]; sheet=Image.new('RGB',(240*8,560*5),'#ddd'); d=ImageDraw.Draw(sheet)
 for i,f in enumerate(group):
  im=Image.open(f); x=(i%8)*240;y=(i//8)*560;sheet.paste(im,(x,y+22));d.text((x+4,y+3),f'{(start+i)*3}s',fill='black')
 sheet.save(f'analysis/contact-{start//40+1}.jpg')
print('samples',len(files))
