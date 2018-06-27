const gulp = require('gulp');
const stylus = require('gulp-stylus');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const cssBase64 = require('gulp-css-base64');
const browserSync = require('browser-sync');
const del = require('del');
const cleanCSS = require('gulp-clean-css');

gulp.task('default', function () {

})

gulp.task('compile-css', function () {
  gulp.src('stylus/!(_)*.styl')
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('css'))
})

gulp.task('compile-es6', function () {
  gulp.src('es2015/*.*')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('js'))
})

gulp.task('build', ['compile-css', 'compile-es6', 'clean'], function () {
  setTimeout(() => {
    gulp.src('*.html')
      .pipe(gulp.dest('dist'));
    gulp.src('js/*.js')
      .pipe(gulp.dest('dist/js'));
    gulp.src('images/*.*')
      .pipe(gulp.dest('dist/images'));
    gulp.src('css/*.css')
      .pipe(cssBase64({
        maxWeightResource: 1024 * 10,
        extensionsAllowed: ['.gif', '.jpg', '.png']
      }))
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(gulp.dest('dist/css'));
  }, 1000)
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
  del.sync('dist');
})


