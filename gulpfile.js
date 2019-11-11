const {src, dest, watch, series, parallel} = require('gulp');
const md = require ('gulp-markdown');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const clean = require('delete');
const typeScript = require('gulp-typescript');
const minify = require('gulp-terser');
const browseSync = require('browser-sync');
const wrap = require('gulp-wrap');
const frontMatter = require('gulp-front-matter');
const fs = require('fs');
const $ = require('jquery');

// function html_task()
// {
//     return src('source/*.html')
//                 .pipe(dest('prod/'));
// }

function js_task()
{
    return src(['source/scripts/*.js', 'source/scripts/*.ts'])
            .pipe(typeScript({target: 'ES5', allowJs: true}))
            .pipe(concat('main.js'))
            .pipe(minify())
            .pipe(dest('prod/scripts/'));
}

function css_task()
{
    return src('source/styles/*.scss')
            .pipe(sass())
            .pipe(dest('prod/styles/'));
}

function markdown_task() 
{
    return src('source/pages/*.md')
      .pipe(frontMatter())
      .pipe(md())
      .pipe(wrap(data => fs.readFileSync('source/pages/templates/' + data.file.frontMatter.template + '.html').toString(),
          null, { engine: 'nunjucks' }))
      .pipe(dest('prod/'));
}

function image_task()
{
    return src('source/images/*.png')
            .pipe(dest('prod/images/'))
}

function watch_task()
{
    watch('source/pages/*.md', series(markdown_task, reload_task));
    watch(['source/scripts/*.js', 'source/scripts/*.ts'], series(js_task, reload_task));
    watch('source/images/*.png', series(image_task, reload_task));
    watch('source/styles/*.scss', series(css_task, reload_task));
    watch('source/pages/templates/*html', series(markdown_task, reload_task));
}

function sync_task(cb)
{
    browseSync.init({server: {baseDir: 'prod/'}});
    (cb);
}

function reload_task(cb){
    browseSync.reload()
    cb();
}

function remove_task(cb)
{
    clean('prod/**', cb)
}

exports.remove = remove_task;
exports.watch = watch_task;
exports.markdown = markdown_task;
exports.build = series(remove_task, parallel(markdown_task, js_task, css_task, image_task));
exports.default = parallel(exports.build,watch_task, sync_task);
