const gulp = require('gulp')
const watch = require('gulp-watch')
const webserver = require('gulp-webserver')

gulp.task('watch', () => {
  watch('app/**/*.html', () => gulp.start('app.html'))
  watch('app/**/*.css', () => gulp.start('app.css'))
  watch('app/**/*.js', () => gulp.start('app.js'))
  watch('assets/**/*.*', () => gulp.start('app.assets'))
  watch('node_modules/admin-lte/dist/css/*.*', () => gulp.start('app.css'))

})

gulp.task('server', ['watch'], () => {
  return gulp.src('public').pipe(webserver({
    livereload: true,
    host: '128.0.0.150',
    port: 8080,
    open: true
  }))
})
