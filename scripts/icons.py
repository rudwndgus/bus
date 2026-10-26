from PIL import Image,ImageDraw,ImageFont
for size in [192,512]:
 im=Image.new('RGB',(size,size),'#064887');d=ImageDraw.Draw(im);f=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',round(size*.42));d.text((size*.15,size*.23),'NJ',font=f,fill='white');im.save(f'public/icon-{size}.png')
