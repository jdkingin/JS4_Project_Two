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
const htmlmin = require('gulp-htmlmin');

function js_task()
{
    return src('source/scripts/*.js')
            .pipe(concat('main.js'))
            .pipe(minify())
            .pipe(dest('prod/scripts/'));
}

function css_task()
{
    return src('source/styles/*.scss')
            .pipe(sass({outputStyle: 'compressed'}))
            .pipe(dest('prod/styles/'));
}

function markdown_task() 
{
    return src('source/pages/*.md')
      .pipe(frontMatter())
      .pipe(md())
      .pipe(wrap(data => fs.readFileSync('source/pages/templates/' + data.file.frontMatter.template + '.html').toString(),
          null, { engine: 'nunjucks' }))
      .pipe(dest('source/'));
}

function html_task()
{
    // Created task to be able to edit raw HMTL files
    return src('source/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('prod/'));
}

function image_task()
{
    return src(['source/images/*.png', 'source/images/*.jpg'])
            .pipe(dest('prod/images/'))
}

function watch_task()
{
    watch('source/pages/*.md', series(markdown_task, reload_task));
    watch(['source/scripts/*.js', 'source/scripts/*.ts'], series(js_task, reload_task));
    watch('source/images/*.png', series(image_task, reload_task));
    watch('source/styles/*.scss', series(css_task, reload_task));
    watch('source/*.html', series(html_task, reload_task));
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
exports.build = series(remove_task, parallel(/*markdown_task,*/ js_task, css_task, image_task, html_task));
exports.default = series(exports.build, parallel(watch_task, sync_task));
