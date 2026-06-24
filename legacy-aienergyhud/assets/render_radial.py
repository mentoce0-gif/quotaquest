#!/usr/bin/env python3
"""Preview of the Radial (circular gauges) skin variant. PIL only."""
import os
from PIL import Image, ImageDraw, ImageFont
FD="/usr/share/fonts/truetype/dejavu"
def f(n,s): return ImageFont.truetype(os.path.join(FD,n),s)
SANS=lambda s:f("DejaVuSans.ttf",s); BOLD=lambda s:f("DejaVuSans-Bold.ttf",s)
MONO=lambda s:f("DejaVuSansMono.ttf",s); MONOB=lambda s:f("DejaVuSansMono-Bold.ttf",s)

bg=(12,16,28); panel=(20,26,42); stroke=(70,95,150); text=(225,235,255)
dim=(140,160,195); hp=(57,255,20); mp=(64,156,255); barbg=(40,50,72); normal=(57,255,20)

S=3
W,H=210,232
img=Image.new("RGB",(W*S,H*S),(10,12,20))
d=ImageDraw.Draw(img)
d.rounded_rectangle([1*S,1*S,(W-1)*S,(H-1)*S],radius=16*S,fill=panel,outline=stroke,width=S)
cx,cy=105*S,105*S
def ring(r_out,r_in,pct,color,track):
    bbox=[cx-r_out,cy-r_out,cx+r_out,cy+r_out]
    bbox_in=[cx-r_in,cy-r_in,cx+r_in,cy+r_in]
    wdt=r_out-r_in
    rmid=(r_out+r_in)//2
    bb=[cx-rmid,cy-rmid,cx+rmid,cy+rmid]
    # track full
    d.arc(bb,0,360,fill=track,width=wdt)
    # value clockwise from top (-90)
    d.arc(bb,-90,-90+360*pct/100,fill=color,width=wdt)
ring(88*S,72*S,87,hp,barbg)
ring(64*S,48*S,63,mp,barbg)
# center text
d.text((cx,cy-10*S),"87%",font=MONOB(34*S),fill=text,anchor="mm")
d.text((cx,cy+16*S),"HP",font=BOLD(11*S),fill=dim,anchor="mm")
# footer
d.text((cx,196*S),"NORMAL",font=BOLD(13*S),fill=normal,anchor="mm")
d.text((cx,214*S),"MP 63%",font=MONO(10*S),fill=mp,anchor="mm")
img.save(os.path.join(os.path.dirname(os.path.abspath(__file__)),"hud_radial.png"))
print("wrote hud_radial.png")
