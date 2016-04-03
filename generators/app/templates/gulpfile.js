'use strict';

var gulp = require('gulp');
var loader = require('stem-gulp-tasks/loader');

loader(__dirname, [
    'copy-root.js',
    'copy-css.js',
    'copy-fonts.js',
    'copy-img.js',

    'jade-html.js',

    'stylus-style.js',

    'js-webpack.js',
  ]);


/**
 * Task groups
 */

gulp.task('copy', [
    'copy-root:build',
    'copy-css:build',
    'copy-fonts:build',
    'copy-img:build',
  ]);

gulp.task('build', [
    'copy',

    'jade-html:build',

    'stylus-style:build',

    'js-webpack:build',
  ]);

gulp.task('dist', ['build']);

gulp.task('default', []);
