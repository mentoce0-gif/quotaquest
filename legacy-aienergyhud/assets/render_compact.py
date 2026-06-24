#!/usr/bin/env python3
"""Render a preview of the Compact (OBS overlay) variant. PIL only."""
import os
from PIL import Image, ImageDraw, ImageFont
FD = "/usr/share/fonts/truetype/dejavu"
def f(n, s): return ImageFont.truetype(os.path.join(FD, n), s)
SANS = lambda s: f("DejaVuSans.ttf", s)
BOLD = lambda s: f("DejaVuSans-Bold.ttf", s)
MONOB = lambda s: f("DejaVuSansMono-Bold.ttf", s)
MONO = lambda s: f("DejaVuSansMono.ttf", s)

P = dict(bg=(8,10,16), panel=(18,22,34), stroke=(70,95,150), text=(225,235,255),
         dim=(140,160,195), hp=(57,255,20), hp2=(31,163,10), mp=(64,156,255), mp2=(28,95,176),
         barbg=(40,50,72), normal=(57,255,20))

def lerp(a,b,t): return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))
def hbar(img,d,x,y,w,h,pct,c1,c2,bg):
    r=h//2
    d.rounded_rectangle([x,y,x+w,y+h],radius=r,fill=bg)
    fw=max(h,int(w*pct/100)); g=Image.new("RGB",(fw,h)); gd=ImageDraw.Draw(g)
    for i in range(fw): gd.line([(i,0),(i,h)],fill=lerp(c1,c2,i/max(fw-1,1)))
    m=Image.new("L",(fw,h),0); ImageDraw.Draw(m).rounded_rectangle([0,0,fw-1,h-1],radius=r,fill=255)
    img.paste(g,(x,y),m)

S=3
W,H=340,84
img=Image.new("RGB",(W*S,H*S),(30,33,40))  # mock OBS backdrop (dark)
d=ImageDraw.Draw(img)
# semi-transparent pill
panel=Image.new("RGBA",(W*S,H*S),(0,0,0,0)); pd=ImageDraw.Draw(panel)
pd.rounded_rectangle([4*S,3*S,326*S,80*S],radius=12*S,fill=(8,10,16,210),outline=P["stroke"],width=S)
img.paste(Image.alpha_composite(img.convert("RGBA"),panel).convert("RGB"),(0,0))
d=ImageDraw.Draw(img)
# HP
d.text((14*S,11*S),"HP",font=BOLD(12*S),fill=P["dim"])
hbar(img,d,46*S,14*S,200*S,12*S,87,P["hp2"],P["hp"],P["barbg"])
d.text((316*S,9*S),"87%",font=MONOB(13*S),fill=P["text"],anchor="ra")
# MP
d.text((14*S,33*S),"MP",font=BOLD(12*S),fill=P["dim"])
hbar(img,d,46*S,36*S,200*S,12*S,63,P["mp2"],P["mp"],P["barbg"])
d.text((316*S,31*S),"63%",font=MONOB(13*S),fill=P["text"],anchor="ra")
# status + party
d.text((14*S,55*S),"NORMAL",font=BOLD(11*S),fill=P["normal"])
d.text((316*S,56*S),"CLAUDE 87%   CODEX 54%",font=MONO(10*S),fill=P["dim"],anchor="ra")
img.save(os.path.join(os.path.dirname(os.path.abspath(__file__)),"hud_compact.png"))
print("wrote hud_compact.png")
