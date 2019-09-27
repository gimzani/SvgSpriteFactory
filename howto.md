# How to Build an SVG Sprite

1. Collect SVG icons, resize to 32x32, name them **icon-[name].svg** OR **icon-[name]-full-color** - and store in **icons** folder.

2. Run gulp.  This will add a class called "icon" to them and place them in **icons/temp**

3. Run Webpack's build to build the sprite.