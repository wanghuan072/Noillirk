# Responsive and interaction plan

Container: min(1400px, viewport minus fluid margins). Default game grid: minmax(0,1fr) 392px with 28px gap. At max-width 1024px: minmax(0,1fr) 320px, 20px gap, hamburger. At max-width 768px: one column; sidebar after article/video; no sticky transform. More Games six/four/two columns; recommendations three/two/two; sidebar always two.

Player, recommendations, article and video share the entire left track. No prose max-width on game text. Guide TOC may scroll internally; game sidebar may not. Controls at least 44px; visible focus; dynamic aria-pressed and aria-expanded; aria-live player feedback. Reduced-motion query removes smooth transitions. No extra width breakpoint or framework responsive variants.
