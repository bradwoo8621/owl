'use strict';

const gulp = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

const assetsPath = './app/assets';

// css related
const sassPath = assetsPath + '/sass';
const sassBundleFile = sassPath + '/bundle.scss';
const sassFiles = assetsPath + '/sass/**/*.scss';
const cssPath = assetsPath + '/css';
const cssFile = 'owl.css';
const cssMinFile = 'owl.min.css';

gulp.task('sass', function () {
	return gulp.src(sassBundleFile)
		.pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
		.pipe(rename(cssFile))
        .pipe(gulp.dest(cssPath))
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename(cssMinFile))
        .pipe(gulp.dest(cssPath));
});
gulp.task('sass:watch', function() {
	gulp.watch(sassFiles, ['sass']);
});

gulp.task('default', function() {
  // place code for your default task here
});

