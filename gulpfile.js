import gulpPkg from "gulp";
const { src, dest, watch, series } = gulpPkg;
import clean from "gulp-clean";
import cleanCss from "gulp-clean-css";
import defaultSass from "sass";
import gulpSass from "gulp-sass";

const sass = gulpSass(defaultSass);

import babel from "gulp-babel";
import uglify from "gulp-uglify";

const css = (cb) => {
  src("./src/scss/styles.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCss({ compatibiliy: "ie8" }))
    .pipe(dest("./static/css"));
  cb();
};

const js = (cb) => {
  src("./src/js/*.js").pipe(babel()).pipe(dest("./static/js"));
  // src("./src/js/*.js").pipe(babel()).pipe(uglify()).pipe(dest("./static/js"));
  cb();
};

const image = (cb) => {
  src("./src/images/*").pipe(dest("./static/images"));
  cb();
};

const cleanJs = (cb) => {
  src("./static/js/*.js").pipe(clean({ allowEmpty: true, read: false }));
  cb();
};
const cleanCSS = (cb) => {
  src("./static/css/*.css").pipe(clean({ allowEmpty: true, read: false }));
  cb();
};
const cleanImages = (cb) => {
  src("./static/images/*").pipe(clean({ allowEmpty: true, read: false }));
  cb();
};

const watchFiles = () => {
  watch("./src/js/**/*.js", cleanJs);
  watch("./src/images/*", cleanImages);
  watch("./src/js/*.js", js);
  watch("./src/images/*", image);
  watch("./src/scss/**/*.scss", css);
};

export const dev = series(js, css, image, watchFiles);
export const build = series(cleanJs, cleanCSS, cleanImages, js, css, image);
