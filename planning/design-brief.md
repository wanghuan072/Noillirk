# Noillirk visual direction — development specification

Status: usable development specification; final visual/media gate unpassed. Real game covers are deliberately absent until permitted. No diagnostic surface counts as a production cover or gameplay capture.

The observed Daily game moves from a deep green forest into open sky and uses a small bright action against a dark frame. Build an original, nonfigurative ascent language: ink-green header, warm paper content, cyan guide lines and a coral primary control. Small vertical ticks connect header mark, player status and article labels. Do not copy pixel characters, landscape art or official lettering.

Compared two layouts: a dark full-page cabinet emphasizes immersion but weakens long-form reading and merges the embedded page with the host; a warm editorial page with a dark play panel separates interaction from explanation and preserves readable text. Choose the latter. Avoid generic neon, stock equipment and decorative gamepad icons.

Wide viewport 1536: outer margins 68px; container 1400px; left 980px, gap 28px, right 392px. At 1024: margins 24px; left 636px, gap 20px, right 320px. At 768: margins 16px; one 736px track. At a 390px phone the track is 358px. Only 1024px and 768px width queries. Home H1 44px, inner 36px; mobile 32px/28px. Body 17px. The player uses its measured future ratio; before measurement a diagnostic minimum height provides an operable start control, not a claim about game aspect ratio.

Wide recommendations: three columns, two rows; at 1024 and mobile two columns. Right Featured and New are separately two columns. More Games uses six/four/two columns. Guide list uses image-and-text rows, stacked on mobile. A Guide with at least four chapters gets a right sticky TOC bounded by article and available viewport height.

Actual Header height is observed with ResizeObserver. Tall game sidebar uses cumulative scroll delta clamped between the top/header boundary and viewport-bottom boundary, then clamped to its parent. Never an internal scrollbar. Mobile clears transforms and sticky behavior. The article remains the full left width after the sidebar ends.

The media gap prevents the requested true-cover high-fidelity design acceptance. Later local preview screenshots are technical/design evidence only. Original site logo and social artwork can be created without claiming they are game captures.
