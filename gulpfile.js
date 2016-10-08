const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const jasmine = require('gulp-jasmine');
const tsProject = ts.createProject("tsconfig.json");

gulp.task("default", ["build", "test", "tslint"]);

gulp.task("build", function () {
  return tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(gulp.dest("./"));
});

gulp.task("tslint", function () {
  gulp.src('lib/*.ts')
    .pipe(tslint({
      formatter: "verbose"
    }))
    .pipe(tslint.report())
});

gulp.task("test", ["build"], function () {
  gulp.src('test/*.spec.js')
    .pipe(jasmine());
});