'use strict';

var gulp = require('gulp');
var loader = require('stem-gulp-tasks/loader');

loader(__dirname, [
    'copy-root.js',
    'copy-css.js',
    'copy-fonts.js',
    'copy-img.js',
    'copy-php.js',
    'copy-python.js',

    'jade-html.js',
    'jade-php.js',

    'stylus-style.js',

    'js-base.js',
  ]);


/**
 * Task groups
 */

gulp.task('copy', [
    'copy-root:build',
    'copy-css:build',
    'copy-fonts:build',
    'copy-img:build',
    'copy-php:build',
    'copy-python:build',
  ]);

gulp.task('build', [
    'copy',

    'jade-html:build',
    'jade-php:build',

    'stylus-style:build',

    'js-base:build',
  ]);

gulp.task('dist', ['build']);

gulp.task('default', []);
