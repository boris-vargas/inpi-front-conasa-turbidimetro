const gulp = require('gulp')
const uglify = require('gulp-uglify')
const uglifycss = require('gulp-uglifycss')
const concat = require('gulp-concat')

gulp.task('deps', ['deps.js', 'deps.css', 'deps.fonts'])

gulp.task('deps.js', () => {
  return gulp.src([
    'node_modules/admin-lte/plugins/jQuery/jquery-2.2.3.min.js',
    'node_modules/angular/angular.min.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'node_modules/angular-animate/angular-animate.min.js',
    'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
    'node_modules/admin-lte/bootstrap/js/bootstrap.min.js',
    'node_modules/admin-lte/plugins/slimScroll/jquery.slimscroll.min.js',
    'node_modules/angular-modal-service/dst/angular-modal-service.min.js',
    'node_modules/admin-lte/dist/js/app.js',
    'node_modules/ng-lodash/build/ng-lodash.min.js',
    'node_modules/alasql/dist/alasql.min.js',
    'node_modules/xlsx/dist/xlsx.core.min.js',
    'node_modules/bootstrap-ui-datetime-picker/dist/datetime-picker.min.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'node_modules/angular-locale-pt-br/angular-locale_pt-br.js',
    'node_modules/angular-popeye/release/popeye.js',
    'node_modules/angularjs-gauge/dist/angularjs-gauge.min.js',
    'node_modules/jquerysparkline/jquery.sparkline.js',
    'node_modules/ng-file-upload/dist/ng-file-upload-shim.min.js',
    'node_modules/ng-file-upload/dist/ng-file-upload.min.js',
    'node_modules/ng-ip-address/src/ngIpAddress.js',
    'node_modules/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
    'node_modules/pdfmake/build/pdfmake.js',
    'node_modules/tc-angular-chartjs/dist',
    //'node_modules/angular-dialog-service/dist/dialogs.js'
  ])
  .pipe(uglify())
  .pipe(concat('deps.min.js'))
  .pipe(gulp.dest('public/assets/js'))
})

gulp.task('deps.css', () => {
  return gulp.src([
    'node_modules/angular-toastr/dist/angular-toastr.min.css',
    'node_modules/font-awesome/css/font-awesome.min.css',
    'node_modules/admin-lte/bootstrap/css/bootstrap.min.css',
    'node_modules/admin-lte/dist/css/AdminLTE.min.css',
    'node_modules/admin-lte/dist/css/skins/_all-skins.min.css',
    'node_modules/angular-popeye/release/popeye.min.css',
    'node_modules/angular-bootstrap-colorpicker/css/colorpicker.css'
  ])
  .pipe(uglifycss({ "uglyComments": true }))
  .pipe(concat('deps.min.css'))
  .pipe(gulp.dest('public/assets/css'))
})

gulp.task('deps.fonts', () => {
  return gulp.src([
    'node_modules/font-awesome/fonts/*.*',
    'node_modules/admin-lte/bootstrap/fonts/*.*'
  ])
  .pipe(gulp.dest('public/assets/fonts'))
})
