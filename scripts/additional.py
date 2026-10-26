import subprocess,imageio_ffmpeg
ff=imageio_ffmpeg.get_ffmpeg_exe()
for name,t in [('rider',5.5),('notice',2.7),('portal',9.2),('activate',21.5),('buy',11.5),('fares',14),('detail',24.7),('instructions',30)]:
 subprocess.run([ff,'-y','-ss',str(t),'-i','IMAGE/Video_20261026_100029_634.mp4','-frames:v','1',f'analysis/frames/{name}.png'],capture_output=True)
