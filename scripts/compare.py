from pathlib import Path
from PIL import Image,ImageDraw
import re,json
out=Path('analysis/local-assets');out.mkdir(exist_ok=True)
pairs=[('home','key-04'),('rider','rider'),('buy','key-19'),('fares','fares')]
for label,ref in pairs:
 a=Image.open('analysis/frames/'+ref+'.png').convert('RGB').crop((0,88,592,1232));b=Image.open('analysis/implementation/'+label+'.png').convert('RGB')
 panel=Image.new('RGB',(1184,1184),'#ddd');panel.paste(a,(0,40));panel.paste(b,(592,40));d=ImageDraw.Draw(panel);d.text((12,12),'REFERENCE',fill='black');d.text((604,12),'IMPLEMENTATION',fill='black');panel.save(out/(label+'-comparison.jpg'))
text=Path('analysis/scene-detection.log').read_text(encoding='utf-8',errors='replace')
times=re.findall(r'pts_time:([\d.]+)',text)
Path('analysis/scene-times.json').write_text(json.dumps({'ffmpeg_filter':"select=gt(scene,0.12)",'video':'Video_20261026_100029_634.mp4','duration_seconds':50.52,'width':592,'height':1280,'scene_detection_count':len(times),'scene_times_seconds':[float(t) for t in times],'note':'Scene detection includes in-motion frames. Stable keyframes were selected after dense 2fps contact-sheet review.'},indent=2))
