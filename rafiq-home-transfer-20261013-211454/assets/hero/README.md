# RAFIQ HERO assets

Original supplied PNGs are retained unchanged: sit-front.png, sit-left.png, sit-right.png, wave.png, crawl-a.png, crawl-b.png. Source filenames correspond to -1 through -6 in the uploaded order.

The matching *-cutout.png files are transparent derivatives made with the built-in image-generation tool. They preserve the supplied baby, expression, blue outfit and pose, and remove the blue studio background. These are used by the hero. The original assets remain available.

Shared final prompt used separately for each of the six source images: Remove only the studio background/floor. Return the same baby on true transparent alpha; preserve gaze, brown hair, blue outfit, pose, expression, hands and proportions. Preserve portrait 4:5 framing and character placement. Retain hair, fingers and toes; no shadow, props or text.

hero.js measures alpha once to normalize CSS scale and floor position; it does not edit the PNG files. Intro uses a raised-arm greeting, then front/left/right gaze layers. Scroll progress: 0–20% sitting, 20–45% lean and sit-to-crawl morph, 45–100% alternate crawl poses and translate RIGHT, ending partly outside the viewport. The crawl remains fully opaque during its rightward exit.

Motion is composed from six still-image poses rather than a recorded continuous crawl. Reduced motion disables the greeting, pointer tracking, breathing and gait, and shortens the scroll range. Mobile uses the same narrative with no mouse tracking.

Navbar, routes, English hero content and all lower sections from #journey onward are preserved. The old BabyInteractive instance is bypassed only for data-mode=poses.
