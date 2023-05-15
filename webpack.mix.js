let mix = require('laravel-mix');
require('laravel-mix-tailwind')
require('laravel-mix-svg-vue')


// config
mix.setPublicPath('dist');
mix.setResourceRoot('dist');
mix.options({
    postCss: [
        require('postcss-import'),
        require('tailwindcss/nesting'),
        require("tailwindcss")("./tailwind.config.js"),
        require('autoprefixer')
    ],
    stats: {
        children: true
    }
});

mix.js('src/js/app.js', 'dist/js')
    .vue()
    .postCss('src/css/app.css', 'dist/css')
    .postCss('src/css/print.css', 'dist/css')
    .svgVue({
            svgPath: 'src/svg',
        }
    )
    .copyDirectory('src/img', 'dist/img');

if (mix.inProduction()) {
    mix.version();
}
