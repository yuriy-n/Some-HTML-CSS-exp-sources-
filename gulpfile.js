var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var concat = require("gulp-concat");
var uglify = require("gulp-uglifyjs");
var cssnano= require("gulp-cssnano");
var rename = require("gulp-rename");
var del = require("del");
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");
var autoprefix = require("gulp-autoprefixer");

/* {outputStyle: "expanded"} */
gulp.task("sass", function() {
	return gulp.src("app/sass/**/*.sass")
	.pipe(sass({outputStyle: "expanded"}).on("error", sass.logError))
	// .pipe(autoprefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], {cascade: true}))
	.pipe(autoprefix({
		browsers: ['last 10 versions'],
            cascade: true
	}))
	.pipe(gulp.dest("app/css"))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task("scripts", function () {
	return gulp.src([
	"app/libs/jquery/dist/jquery.min.js",
	"app/libs/magnific-popup/dist/jquery.magnific-popup.min.js"
	])
	.pipe(concat("libs.min.js"))
	.pipe(uglify())
	.pipe(gulp.dest("app/js/"))
});

gulp.task("cssLibs", ["sass"], function () {
	return gulp.src("app/css/libs.css")
	.pipe(cssnano())
	.pipe(rename({suffix: ".min"}))
	.pipe(gulp.dest("app/css/"))
});

gulp.task("browSync", function () {
	browserSync({
		server: {
			baseDir: "app"
		},
		notify: false
	});
});

gulp.task("clean", function () {
	return del.sync("dist/*")
});

gulp.task("image", function () {
	return gulp.src("app/img/**/*")
	.pipe(imagemin ({
		interlaced: true,
	    progressive: true,
	    svgoPlugins: [{removeViewBox: false}],
	    use: [pngquant()]
	}))
	.pipe(gulp.dest("dist/img"));
});

gulp.task("watch", ["cssLibs", "sass", "scripts", "browSync"], function () {
	gulp.watch("app/sass/**/*.sass", ["sass"]);
	gulp.watch("app/*.html", browserSync.reload);
	gulp.watch("app//**/*.js", browserSync.reload);
});

gulp.task("build", ["clean", "sass", "scripts", "image"], function () {

	var buildCss = gulp.src([
		"app/css/libs.min.css",
		"app/css/main.css",
		])
	.pipe(gulp.dest("dist/css"));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest("dist/fonts"));

	var buildJs = gulp.src("app/js/**/*")
	.pipe(gulp.dest("dist/js"));

	var buildHTML = gulp.src("app/*.html")
	.pipe(gulp.dest("dist"));
});

