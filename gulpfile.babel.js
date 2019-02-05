import gulp from 'gulp';
import del from  'del';
import scss from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import browser from 'browser-sync';

const browserSync = browser.create();

const paths = {
  html: {
    src: 'src/html/**/*.html',
    dest: 'build/'
  },
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'build/styles/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'build/js/'
  },
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png}',
    dest: 'build/img/'
  },
  fonts: {
    src: 'src/fonts',
    dest: 'src/'
  }
};

const browserSyncServer = (done) => {
  browserSync.init({
    server: {
      baseDir: 'build/'
    },
    port: 3000
  });
  done()
};

export const clean = () => (del([ 'build' ]));

export const layout = () => (
  gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream())
);

export const styles = () => (
  gulp.src(paths.styles.src)
    .pipe(scss())
    .pipe(cleanCss())
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream())
);

export const scripts = () => (
  gulp.src(paths.scripts.src, {sourcemaps: true})
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream())
);

export const images = () => (
  gulp.src(paths.images.src, {since: gulp.lastRun(images)})
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false},
        ]
      })
    ]))
    .pipe(gulp.dest(paths.images.dest))
);

export const fonts = () => (
  gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.stream())
);

export const watchFiles = () => {
  gulp.watch(paths.html.src, layout).on('change', browserSync.reload);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.images.src, fonts);
};

const build = gulp.series(clean, gulp.parallel(layout, styles, scripts, images, fonts));
export const watch = gulp.parallel(watchFiles, browserSyncServer);

export default build;