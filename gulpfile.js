var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();
var sass = require('gulp-ruby-sass');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS   = require('gulp-minify-css');
var concat      = require('gulp-concat');
var es         = require('event-stream');

gulp.task('styles', function () {
    return sass('./src/scss/styles.scss')
      .pipe(autoprefixer({
           browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
           cascade:  true
       })) 
      .pipe(concat('styles.min.css'))
      .pipe(minifyCSS({advanced: false}))
      .pipe(gulp.dest('./dist/'))
      .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src('./src/js/formvalidation.js')
    .pipe(uglify())
    .pipe(rename('formvalidation.min.js'))
    .pipe(gulp.dest('dist'));
});


gulp.task('watch', function (){
    gulp.watch(['./src/js/formvalidation.js'], ['scripts']);
    gulp.watch(['./src/scss/styles.scss'], ['styles']);
});


gulp.task('default', ['scripts', 'watch']);


