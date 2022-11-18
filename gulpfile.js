import gulpPkg from "gulp";
const { src, dest, watch, series } = gulpPkg;
import clean from "gulp-clean";
import cleanCss from "gulp-clean-css";
import dotenv from "dotenv";
dotenv.config();

import defaultSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(defaultSass);

import babel from "gulp-babel";
import uglify from "gulp-uglify";

const js = (cb) => {
  src("./src/js/**/*.js").pipe(babel()).pipe(uglify()).pipe(dest("static/js"));
  cb();
};

const css = (cb) => {
  src("./src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCss({ compatibility: "ie8" }))
    .pipe(dest("static/css"));
  cb();
};

const images = (cb) => {
  src("./src/images/*").pipe(dest("static/images"));
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

const watchFile = () => {
  watch("./src/js/**/*.js", cleanJs);
  watch("./src/images/*", cleanImages);
  watch("./src/js/**/*.js", js);
  watch("./src/images/*", images);
  watch("./src/scss/**/*.scss", css);
};

export const dev = series(js, css, images, watchFile);
export const prod = series(cleanJs, cleanCSS, cleanImages, js, css, images);
//export default series(js, css, image, watchFiles);
