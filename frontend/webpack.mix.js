let mix = require('laravel-mix');

mix.setPublicPath('../server');
mix.react('src/index.jsx', 'public/js');