/**
 * Created by snackoo on 3/30/17.
 */
// Gulp plugin setup
var gulp = require('gulp');
// Watches single files
var watch = require('gulp-watch');
var gulpShopify = require('gulp-shopify-upload');

gulp.task('shopifywatch', function() {
    return watch('./+(assets|layout|config|snippets|templates|locales)/**')
        .pipe(gulpShopify('d90eca3fddd8caaca1d97e29a517f9e4', 'af82614f14f198245305c811ad52da5b', 'snackootest.myshopify.com', '151384651'));
});
gulp.task('deploy', ['build'], function() {
    return gulp.src('./+(assets|layout|config|snippets|templates|locales)/**')
        .pipe(gulpShopify('d90eca3fddd8caaca1d97e29a517f9e4', 'af82614f14f198245305c811ad52da5b', 'snackootest.myshopify.com', '151384651'));

});




var postcss = require('gulp-postcss');

gulp.task('css', function() {
    var processors = [
        autoprefixer
    ];
    return gulp.src('./css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./build/'));
});

function autoprefixer(css) {
    css.walkDecls(function(decl) {
        if (decl.prop === 'border-radius' || decl.prop === 'transition') {
            decl.cloneBefore({prop: '-moz-' + decl.prop});
            decl.cloneBefore({prop: '-o-' + decl.prop});
            decl.cloneBefore({prop: '-webkit-' + decl.prop});
        }
        return decl;
    });
}