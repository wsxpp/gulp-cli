const gulp = require('gulp');
const stylus = require('gulp-stylus');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const cssBase64 = require('gulp-css-base64');
const browserSync = require('browser-sync');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');

gulp.task('compile-css', function () {
  return gulp.src('stylus/!(_)*.styl')
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('css'))
})

gulp.task('compile-es6', function () {
  return gulp.src('es2015/*.*')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('js'))
})

gulp.task('serve', ['compile-css', 'compile-es6'], function () {
  browserSync.init({
    files: ['css/*.css', '*.html', 'js/*.js'],
    server: {
      baseDir: './',  // 设置服务器的根目录
      index: 'index.html' // 指定默认打开的文件
    },
    // proxy: 'localhost', // 设置本地服务器的地址
    port: 3000  // 指定访问服务器的端口号
  });
  gulp.watch('stylus/!(_)*.styl', ['compile-css'])
  gulp.watch('es2015/*.js', ['compile-es6'])
});

gulp.task('clean', function () {
  return del.sync('dist');
})

gulp.task('build-css', ['compile-css'], function () {
  return gulp.src('css/*.css')
    .pipe(cssBase64({
      maxWeightResource: 1024 * 10,
      extensionsAllowed: ['.gif', '.jpg', '.png']
    }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rev())
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'));
})

gulp.task('build-js', ['compile-es6'], function () {
  return gulp.src('js/*.js')
    .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'));
})

gulp.task('build-images', ['clean'], function () {
  return gulp.src(['images/*.jpg','images/*/*.jpg'])
    .pipe(rev())
    .pipe(gulp.dest('dist/images'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/images'));
})

gulp.task('build', ['build-css', 'build-js', 'build-images'], function () {
  return gulp.src(['rev/**/*.json', '*.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('dist'));
})
