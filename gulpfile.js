const gulp      = require('gulp');
const cheerio   = require('gulp-cheerio');
const changed   = require('gulp-changed');
const webpack   = require('webpack-stream');

var paths = {
  srcIcons: 'src/icons/*.svg',
  tempIcons: 'src/icons/temp',
  srcIconsTemp: 'src/icons/temp/*.svg',
  dist: 'dist/'
};

gulp.task('icon-class', function () {
  return gulp
    .src(paths.srcIcons)
    .pipe(changed(paths.tempIcons))
    .pipe(cheerio({
      run: function ($, file) {
        var $svg = $('svg');
        if (file.relative.indexOf('-full-color') >= 0) {  //adds additional class if '-full-color' is in filename
          $svg.addClass('icon icon--full-color')
        }
        $svg.addClass('icon');
      }
    }))
   .pipe(gulp.dest(paths.tempIcons));
});

gulp.task('default', gulp.parallel('icon-class'), function () {
  return gulp.src('index.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('dist/'));
  });