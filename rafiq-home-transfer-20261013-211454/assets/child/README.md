# RAFIQ portrait assets

baby-01.png is the generated transparent baby cutout based on reference.jpeg, created with the built-in image generation tool. Original reference remains unchanged.

Replace/add these portrait files to activate the growing-child scenes, without editing JavaScript:
- age-04.webp
- age-07.webp
- age-11.webp
- age-14.webp
- age-18.webp

Until supplied, later scenes show the baby with a clearly labeled portrait-preview note. These are placeholders, not age-progressed portraits. Use the same child identity, studio lighting, front-facing camera, centered full body, transparent background, and matched ground position. A square canvas (~1248px) matches the installed baby and motion masks.

Hero mode is configured on #babyInteractive in index.html: data-mode=layered (default), video with data-video and data-front, or sequence with a JSON data-frames array and data-front. Videos never autoplay and seek only after the prior seek completes. Genuine head turns need a sequence/video; the layered fallback only simulates subtle motion.

Generation prompt: preserve the reference baby's identity, brown hair, cream outfit, seated pose, realistic studio photography; gently face camera; full body centered with transparent padding; remove background and floor shadow; no props or text.

Account routes were not present in the supplied project. Log In displays an honest preview dialog. Get Started retains the existing #contact destination. Existing Mainframe lower content and mailto links are intentionally preserved.
