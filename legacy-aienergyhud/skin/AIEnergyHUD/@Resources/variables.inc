[Variables]
; ===== AI Energy HUD — layout + active theme selector =====
; The active palette/typography lives in Themes\<Theme>.inc and is swapped
; from the skin's right-click menu (writes Theme= here, then refreshes).
Theme=Cyberpunk

; Layout (theme-independent)
W=440
BarW=310
BarH=16

; Load the selected theme's palette + fonts.
@Include=#@#Themes\#Theme#.inc
