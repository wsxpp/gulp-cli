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
const browserify = require("browserify");
// const sourcemaps = require("gulp-sourcemaps");
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const connect = require('gulp-connect');
const proxy = require('http-proxy-middleware');


const needRev = false;

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
  // var b = browserify({
  //   entries: "es2015/index.js", //入口点js
  //   debug: true //是告知Browserify在运行同时生成内联sourcemap用于调试
  // });
  // return b.bundle()
  //   .pipe(source("index.js"))
  //   .pipe(buffer())
  //   .pipe(babel({
  //     presets: ['env']
  //   }))
  //   // .pipe(sourcemaps.init({ loadMaps: true }))
  //   // .pipe(sourcemaps.write("."))
  //   .pipe(gulp.dest("js"));
})

gulp.task('serve', ['compile-css', 'compile-es6'], function () {
  // browserSync.init({
  //   files: ['css/*.css', '*.html', 'js/*.js'],
  //   server: {
  //     baseDir: './',  // 设置服务器的根目录
  //     index: 'index.html' // 指定默认打开的文件
  //   },
  //   // proxy: 'localhost', // 设置本地服务器的地址
  //   port: 3000  // 指定访问服务器的端口号
  // });
  connect.server({
    root: './',
    livereload: true,
    port: 3000,
    host: '192.168.1.107',
    middleware: function (connect, opt) {
      return [
        proxy('/api', {
          target: 'http://test-axatp.55hudong.com',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ""
          }
        })
      ]
    }
  });
  gulp.watch('stylus/*.styl', ['compile-css'])
  gulp.watch('es2015/*.js', ['compile-es6'])
  gulp.watch('css/*.css', ['reload'])
  gulp.watch('js/*.js', ['reload'])
  gulp.watch('*.html', ['reload'])
});

gulp.task('reload', function () {
  gulp.src('*.html')
    .pipe(connect.reload());
});

gulp.task('clean', function () {
  return del.sync('dist');
})

gulp.task('build-images', ['clean'], function () {
  if (needRev) {
    return gulp.src(['images/*.jpg', 'images/*.png', 'images/*.gif'])
      .pipe(rev())
      .pipe(gulp.dest('dist/images'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('rev/images'));
  } else {
    return gulp.src(['images/*.jpg', 'images/*.png', 'images/*.gif'])
      .pipe(gulp.dest('dist/images'))
  }
})

gulp.task('build-css', ['compile-css', 'build-images'], function () {
  if (needRev) {
    return gulp.src(['rev/**/*.json', 'css/*.css'])
      .pipe(cssBase64({
        maxWeightResource: 1024 * 10,
        extensionsAllowed: ['.gif', '.jpg', '.png']
      }))
      .pipe(revCollector({
        replaceReved: true,
      }))
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(rev())
      .pipe(gulp.dest('dist/css'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('rev/css'));
  } else {
    return gulp.src('css/*.css')
      .pipe(cssBase64({
        maxWeightResource: 1024 * 10,
        extensionsAllowed: ['.gif', '.jpg', '.png']
      }))
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(gulp.dest('dist/css'))
  }
})

gulp.task('build-js', ['compile-es6', 'build-css'], function () {
  if (needRev) {
    return gulp.src(['rev/**/*.json', 'js/*.js'])
      .pipe(revCollector({
        replaceReved: true
      }))
      .pipe(rev())
      .pipe(gulp.dest('dist/js'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('rev/js'));
  } else {
    return gulp.src('js/*.js')
      .pipe(gulp.dest('dist/js'))
  }
})

gulp.task('build', ['build-js'], function () {
  gulp.src('libs/**.*')
    .pipe(gulp.dest('dist/libs'))
  if (needRev) {
    return gulp.src(['rev/**/*.json', '*.html'])
      .pipe(revCollector({
        replaceReved: true
      }))
      .pipe(gulp.dest('dist'));
  } else {
    return gulp.src('*.html')
      .pipe(gulp.dest('dist'));
  }
})


