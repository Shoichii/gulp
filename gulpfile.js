import gulp from 'gulp';
const { src, dest, task, series, parallel, watch } = gulp;
import { deleteSync } from 'del';
import htmlmin from 'gulp-htmlmin';
import fileinclude from 'gulp-file-include';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import cssmin from 'gulp-cssmin';
import rename from 'gulp-rename';
import browserSyncFrom from 'browser-sync'
const browserSync = browserSyncFrom.create();
import babel from 'gulp-babel';
import terser from 'gulp-terser';

async function clear() {
    return await deleteSync(['./build/**/*']);
}

const html = () => {
    return src('./src/*.html')
        .pipe(fileinclude({
            prefix: '@@'
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('./build/'));
}

const scss = () => {
    return src('./src/css/style.scss')
        .pipe(sass())
        .pipe(cssmin())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(dest('./build/css/'));
}

const js = () => {
    return src('./src/scripts/*.js')
        .pipe(babel())
        .pipe(terser())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(dest('./build/scripts/'));
}

const img = () => {
    return src('./src/img/**/*')
        .pipe(dest('./build/img/'));
}

const serve = () => {
    browserSync.init({
        server: "./build/",
        notify: false
    })
    
    watch('./src/**/*', series(clear, parallel(html, scss, js, img))).on('change', browserSync.reload);
};

task('default', series(clear, parallel(html, scss, js, img), serve));