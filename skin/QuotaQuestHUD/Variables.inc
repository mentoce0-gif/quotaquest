[Variables]
; ---- QuotaQuest HUD :: user-editable settings -------------------------------
StatePath=#@#state.json

; Layout (px) — defined first so themes can reference #Opacity# etc.
PanelWidth=360
PanelHeight=172
PanelHeight2=196
BarX=92
BarWidth=122
ValueX=344
Opacity=180

; ---- THEME (swap the look by changing this ONE line) ------------------------
; Bundled themes live in @Resources/Themes/ : Default.inc · Minimal.inc · Cyberpunk.inc
; Drop in your own .inc (same keys) and point here. See docs/SKINNING.md.
@includeTheme=#@#Themes/Default.inc
