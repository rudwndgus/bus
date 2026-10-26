import imageio_ffmpeg,subprocess
from PIL import Image,ImageDraw
ff=imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([ff,'-y','-i','IMAGE/Video_20261026_100029_634.mp4','-vf','fps=2,scale=148:-1','analysis/frames/dense-%03d.jpg'],capture_output=True)
import pathlib
fs=list(pathlib.Path('analysis/frames').glob('dense-*.jpg'))
for a in range(0,len(fs),40):
 g=fs[a:a+40]; im=Image.new('RGB',(148*8,340*5),'#ddd');d=ImageDraw.Draw(im)
 for i,f in enumerate(g):
  x=i%8*148;y=i//8*340; im.paste(Image.open(f),(x,y+20));d.text((x,y),str((a+i)/2)+'s',fill='black')
 im.save(f'analysis/dense-{a//40+1}.jpg')
