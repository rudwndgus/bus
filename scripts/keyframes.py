import imageio_ffmpeg, subprocess, pathlib
ff=imageio_ffmpeg.get_ffmpeg_exe()
for t in [4,7,10,13,16,19,21,23,36,40,43,46,49]:
 subprocess.run([ff,'-y','-ss',str(t),'-i','IMAGE/Video_20261026_100029_634.mp4','-frames:v','1',f'analysis/frames/key-{t:02}.png'],capture_output=True)
subprocess.run([ff,'-y','-i','IMAGE/Video_20261026_100029_634.mp4','-vf',"select='gt(scene,0.12)',showinfo",'-vsync','vfr','analysis/frames/scene-%03d.png'],stderr=open('analysis/scene-detection.log','w'),stdout=subprocess.DEVNULL)
