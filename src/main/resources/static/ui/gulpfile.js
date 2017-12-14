var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var strip = require('gulp-strip-comments');
var replace = require('gulp-replace');
var googleWebFonts = require('gulp-google-webfonts');

var options = {
    fontsDir: './font/googlefonts/',
    cssDir: './css/',
    cssFilename: 'myGoogleFonts.css'
};


gulp.task('fonts', function () {
    return gulp.src('./font/googlefonts/fonts.list')
        .pipe(googleWebFonts(options))
        .pipe(gulp.dest('./'));
});

gulp.task('css', function () {

    gulp.src([
        './css/animate.css',
        './css/animation.css',
        './css/bootstrap.css',
        './css/fonts.css',
        './css/md-icons.css',
        './css/angular-toggle-switch-bootstrap-3.css',
        './css/highlight.css',
        './css/chat.css',
        './bootstrap-select/css/nya-bs-select.css',
        './css/font-awesome-animation.css',
        './kdate/css/jquery.calendars.picker.css',
        './css/select.css',
        './chosen/chosen.css'
    ])
        .pipe(replace('/*!', '/*'))
        .pipe(concat('app.css'))
        .pipe(cleanCSS({specialComments: 'all'}))
        .pipe(gulp.dest('./'));

});

gulp.task('scripts', function () {

    gulp.src([

        './js/material.js',
        './js/mdl-ext.js',
        './js/fontawesome.js',
        './js/jquery.js',

        './kdate/js/jquery.calendars.js',
        './kdate/js/jquery.calendars-ar.js',
        './kdate/js/jquery.calendars-ar-EG.js',
        './kdate/js/jquery.plugin.js',
        './kdate/js/jquery.calendars.picker.js',
        './kdate/js/jquery.calendars.picker-ar.js',
        './kdate/js/jquery.calendars.picker-ar-EG.js',
        './kdate/js/jquery.calendars.picker.lang.js',
        './kdate/js/jquery.calendars.ummalqura.js',
        './kdate/js/jquery.calendars.ummalqura-ar.js',
        './kdate/js/jquery.calendars.plus.js',

        './js/jquery-ui.js',
        './js/angular.js',
        './js/angular-locale_ar.js',
        './js/angular-sanitize.js',
        './js/angular-ui-router.js',
        './js/angular-animate.js',
        './js/angular-touch.js',

        './angular-spinner/spin.js',
        './angular-spinner/angular-spinner.js',
        './angular-spinner/angular-loading-spinner.js',

        './js/ui-bootstrap.js',
        './js/ui-bootstrap-tpls.js',

        './js/select.js',

        './sockjs/sockjs.js',
        './stomp-websocket/lib/stomp.js',
        './ng-stomp/ng-stomp.js',
        './kdate/kdate.module.js',
        './kdate/kdate.filter.js',
        './kdate/kdate.picker.js',
        './js/underscore.js',
        './js/lrDragNDrop.js',
        './js/contextMenu.js',
        './js/lrStickyHeader.js',
        './js/smart-table.js',
        './js/stStickyHeader.js',
        './js/angular-pageslide-directive.js',
        './js/elastic.js',
        './js/scrollglue.js',
        './ng-upload/angular-file-upload.js',
        './bootstrap-select/js/nya-bs-select.js',
        './js/angular-css.js',
        './js/angular-timer-all.js',
        './full-screen/angular-fullscreen.js',
        './animate-counter/angular-counter.js',
        './js/angular-focusmanager.js',
        './js/jcs-auto-validate.js',
        './js/angular-toggle-switch.js',
        './js/chosen.jquery.js',
        './chosen/angular-chosen.js',
        './js/sortable.js',
        './js/FileSaver.js',
        './js/jquery.noty.packaged.js',
        './angular-chart/Chart.js',
        './angular-chart/angular-chart.js',

        './init/config/config.js',
        './init/factory/companyFactory.js',
        './init/factory/customerFactory.js',
        './init/factory/supplierFactory.js',
        './init/factory/contractFactory.js',
        './init/factory/contractAttachFactory.js',
        './init/factory/employeeFactory.js',
        './init/factory/personFactory.js',
        './init/factory/contractReceiptFactory.js',
        './init/factory/teamFactory.js',

        './init/service/service.js',
        './init/directive/directive.js',
        './init/filter/filter.js',
        './init/run/run.js',

        './partials/home/home.js',
        './partials/menu/menu.js',
        './partials/company/company.js',

        './partials/team/team.js',
        './partials/team/teamCreateUpdate.js',

        './partials/customer/customer.js',
        './partials/customer/customerDetails.js',
        './partials/customer/customerCreateUpdate.js',

        './partials/supplier/supplier.js',
        './partials/supplier/supplierCreateUpdate.js',

        './partials/contract/contract.js',
        './partials/contract/contractCreateUpdate.js',
        './partials/contract/contractAttachUpload.js',
        './partials/contract/receiptCreateByContract.js',

        './partials/employee/employee.js',
        './partials/employee/employeeCreateUpdate.js',

        './partials/contractReceipt/contractReceipt.js',
        './partials/contractReceipt/contractReceiptCreate.js',

        './partials/report/report.js',
        './partials/report/person/personsIn.js',

        './partials/help/help.js',
        './partials/profile/profile.js',
        './partials/about/about.js'

    ])
        .pipe(strip())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./'))

});

gulp.task('default', ['css', 'scripts']);