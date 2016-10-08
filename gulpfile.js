var gulp = require("gulp");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var tsProject = ts.createProject("src/tsconfig.json");

gulp.task("default", ["build", "tslint"]);

gulp.task("build", function () {
    return tsProject.src()
    .pipe(tsProject()).js
    .pipe(gulp.dest("lib/"));
});

gulp.task("tslint", function () {
  tsProject.src()
    .pipe(tslint({
      formatter: "verbose"
    }))
    .pipe(tslint.report())
});
