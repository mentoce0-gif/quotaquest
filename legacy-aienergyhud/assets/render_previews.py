#!/usr/bin/env python3
"""Render high-fidelity PNG previews of the AI Energy HUD (and a 6-theme grid).
Pure PIL — no browser/SVG needed. Run: python3 render_previews.py"""
import os
from PIL import Image, ImageDraw, ImageFont

FDIR = "/usr/share/fonts/truetype/dejavu"
def font(name, size): return ImageFont.truetype(os.path.join(FDIR, name), size)
SANS   = lambda s: font("DejaVuSans.ttf", s)
BOLD   = lambda s: font("DejaVuSans-Bold.ttf", s)
MONO   = lambda s: font("DejaVuSansMono.ttf", s)
MONOB  = lambda s: font("DejaVuSansMono-Bold.ttf", s)
SERIFB = lambda s: font("DejaVuSerif-Bold.ttf", s)

# Palettes mirror @Resources/Themes/*.inc  (RGB tuples)
THEMES = {
 "Cyberpunk": dict(bg=(12,16,28), panel=(22,28,46), stroke=(70,95,150), text=(225,235,255),
   dim=(140,160,195), accent=(120,180,255), hp=(57,255,20), hp2=(31,163,10), warn=(255,212,0),
   crit=(255,59,59), mp=(64,156,255), mp2=(28,95,176), barbg=(40,50,72), head=BOLD, light=False),
 "Fantasy": dict(bg=(20,16,34), panel=(36,28,56), stroke=(150,120,70), text=(245,238,220),
   dim=(190,170,140), accent=(235,200,120), hp=(120,220,140), hp2=(70,150,95), warn=(240,200,90),
   crit=(230,80,90), mp=(150,140,255), mp2=(95,90,180), barbg=(58,48,78), head=SERIFB, light=False),
 "Minimal": dict(bg=(245,247,250), panel=(255,255,255), stroke=(210,216,226), text=(30,36,48),
   dim=(120,130,148), accent=(40,120,230), hp=(34,197,94), hp2=(22,150,70), warn=(234,179,8),
   crit=(239,68,68), mp=(59,130,246), mp2=(40,95,190), barbg=(226,232,240), head=BOLD, light=True),
 "Terminal": dict(bg=(2,8,4), panel=(6,16,8), stroke=(20,70,30), text=(130,255,150),
   dim=(70,150,90), accent=(120,255,140), hp=(60,255,90), hp2=(30,160,55), warn=(220,230,60),
   crit=(255,80,80), mp=(60,220,150), mp2=(28,130,90), barbg=(12,34,16), head=MONOB, light=False),
 "Mascot": dict(bg=(26,28,46), panel=(42,44,72), stroke=(110,120,180), text=(240,242,255),
   dim=(170,176,210), accent=(160,200,255), hp=(126,232,168), hp2=(80,170,115), warn=(255,221,120),
   crit=(255,128,150), mp=(140,170,255), mp2=(90,115,190), barbg=(58,62,96), head=BOLD, light=False),
 "Radial": dict(bg=(8,10,18), panel=(14,18,30), stroke=(44,60,96), text=(235,242,255),
   dim=(130,148,184), accent=(0,224,255), hp=(0,230,160), hp2=(0,150,105), warn=(255,196,0),
   crit=(255,64,96), mp=(0,196,255), mp2=(0,120,170), barbg=(26,34,54), head=BOLD, light=False),
}

def lerp(a,b,t): return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))

def hbar(d, x, y, w, h, pct, c1, c2, barbg):
    r = h//2
    d.rounded_rectangle([x,y,x+w,y+h], radius=r, fill=barbg)
    fw = max(h, int(w*pct/100))
    # gradient fill onto a temp masked layer
    grad = Image.new("RGB",(fw,h))
    gd = ImageDraw.Draw(grad)
    for i in range(fw):
        gd.line([(i,0),(i,h)], fill=lerp(c1,c2,i/max(fw-1,1)))
    mask = Image.new("L",(fw,h),0)
    ImageDraw.Draw(mask).rounded_rectangle([0,0,fw-1,h-1], radius=r, fill=255)
    d._image.paste(grad,(x,y),mask)

def render_hud(theme, hp, mp, status, scale=2, party=("CLAUDE 87% NORMAL","CODEX 54% WARNING")):
    P = THEMES[theme]
    W,H = 520,300
    img = Image.new("RGB",(W*scale,H*scale), P["bg"])
    d = ImageDraw.Draw(img); d._image = img
    S = scale
    def F(fn,s): return fn(s*S)
    pad=16*S
    # panel
    d.rounded_rectangle([pad,pad,W*S-pad,H*S-pad], radius=16*S, fill=P["panel"],
                        outline=P["stroke"], width=max(1,S))
    x=pad+18*S
    # title
    d.text((x,pad+16*S), "◆ AI ENERGY HUD  v1.0", font=F(BOLD,12), fill=P["accent"])
    d.text((W*S-pad-18*S, pad+16*S), "● ONLINE", font=F(BOLD,12), fill=P["hp"], anchor="ra")
    # HP
    yy=pad+54*S
    d.text((x,yy-2*S),"HP",font=F(BOLD,14),fill=P["dim"])
    hbar(d, x+40*S, yy, 300*S, 18*S, hp, P["hp2"], P["hp"], P["barbg"])
    d.text((W*S-pad-18*S, yy-2*S), f"{hp}%", font=F(MONOB,16), fill=P["text"], anchor="ra")
    d.text((x+40*S, yy+24*S), "♥  425,362 / 500,000 tokens".replace("♥","◆"), font=F(SANS,11), fill=P["dim"])
    # MP
    yy=pad+102*S
    d.text((x,yy-2*S),"MP",font=F(BOLD,14),fill=P["dim"])
    hbar(d, x+40*S, yy, 300*S, 18*S, mp, P["mp2"], P["mp"], P["barbg"])
    d.text((W*S-pad-18*S, yy-2*S), f"{mp}%", font=F(MONOB,16), fill=P["text"], anchor="ra")
    d.text((x+40*S, yy+24*S), "◷  session 186 / 300 min", font=F(SANS,11), fill=P["dim"])
    # stats row
    yy=pad+152*S
    d.text((x,yy),"↻ REGEN  +2,140/min", font=F(SANS,12), fill=P["text"])
    d.text((W*S-pad-18*S,yy),"RECOVERY  01:52:18", font=F(MONO,12), fill=P["text"], anchor="ra")
    yy=pad+172*S
    d.text((x,yy),"▲ BURN  12.4k/h", font=F(SANS,12), fill=P["text"])
    sc = {"NORMAL":P["hp"],"WARNING":P["warn"],"CRITICAL":P["crit"]}[status]
    d.text((W*S-pad-18*S,yy), f"STATUS  {status}", font=F(BOLD,13), fill=sc, anchor="ra")
    # divider + EXP
    yy=pad+196*S
    d.line([x,yy,W*S-pad-18*S,yy], fill=P["stroke"], width=max(1,S))
    d.text((x,yy+8*S),"EXP   today 1.82M    week 8.73M    month 32.41M", font=F(SANS,11), fill=P["dim"])
    # party
    yy=pad+220*S
    d.text((x,yy),"PARTY", font=F(BOLD,12), fill=P["accent"])
    d.text((x+70*S,yy), party[0], font=F(MONO,11), fill=P["hp"])
    d.text((x+260*S,yy), party[1], font=F(MONO,11), fill=P["warn"])
    return img

OUT=os.path.dirname(os.path.abspath(__file__))

# 1) Hero / screenshot — Cyberpunk
hero = render_hud("Cyberpunk", 87, 63, "NORMAL")
hero.save(os.path.join(OUT,"hud_cyberpunk.png"))

# 2) Critical-state shot (shows color change) — Cyberpunk
crit = render_hud("Cyberpunk", 11, 24, "CRITICAL", party=("CLAUDE 11% CRITICAL","CODEX ?? UNKNOWN"))
crit.save(os.path.join(OUT,"hud_critical.png"))

# 3) Theme grid (2x3)
samples=[("Cyberpunk",87,63,"NORMAL"),("Fantasy",89,67,"NORMAL"),("Minimal",83,55,"NORMAL"),
         ("Terminal",72,48,"NORMAL"),("Mascot",54,60,"WARNING"),("Radial",38,30,"WARNING")]
thumbs=[render_hud(n,hp,mp,st,scale=1) for n,hp,mp,st in samples]
tw,th=thumbs[0].size
gap=18; cols=3; rows=2
gridbg=(10,12,22)
grid=Image.new("RGB",(cols*tw+(cols+1)*gap, rows*th+(rows+1)*gap+30), gridbg)
gd=ImageDraw.Draw(grid)
for i,(im,(n,_,_,_)) in enumerate(zip(thumbs,samples)):
    c=i%cols; r=i//cols
    px=gap+c*(tw+gap); py=gap+r*(th+gap)
    grid.paste(im,(px,py))
    gd.text((px+8,py+th-2),n,font=BOLD(13),fill=(210,220,240))
gd.text((gap, rows*th+(rows+1)*gap+6), "AI Energy HUD — 6 themes (right-click to switch)",
        font=BOLD(14), fill=(150,180,230))
grid.save(os.path.join(OUT,"themes_grid.png"))
pri