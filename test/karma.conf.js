// Karma configuration
module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    //basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      '../bower_components/jquery/dist/jquery.js',
      '../bower_components/angular/angular.js',
      '../bower_components/bootstrap/dist/js/bootstrap.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../bower_components/ui-router/release/angular-ui-router.js',
      '../bower_components/angular-animate/angular-animate.js',
      '../bower_components/angular-translate/angular-translate.js',
      '../bower_components/angular-translate-loader-url/angular-translate-loader-url.js',
      '../bower_components/ng-dialog/js/ngDialog.js',
      '../bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      '../bower_components/angular-resource/angular-resource.js',
      '../bower_components/angular-messages/angular-messages.js',
      '../bower_components/toastr/toastr.js',
      '../bower_components/angular-facebook/lib/angular-facebook.js',
      '../bower_components/angular-directive.g-signin/google-plus-signin.js',
      '../bower_components/moment/moment.js',
      '../bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
      '../bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
      '../bower_components/mixpanel/mixpanel-jslib-snippet.js',
      '../bower_components/angular-mixpanel/src/angular-mixpanel.js',
      '../bower_components/angular-simple-logger/dist/angular-simple-logger.js',
      '../bower_components/lodash/lodash.js',
      '../bower_components/angular-google-maps/dist/angular-google-maps.js',
      '../bower_components/spin.js/spin.js',
      '../bower_components/angular-spinner/angular-spinner.js',
      '../bower_components/ng-file-upload/ng-file-upload.js',
      '../bower_components/ng-file-upload-shim/ng-file-upload-shim.js',
      '../bower_components/angular-google-plus/dist/angular-google-plus.js',
      '../bower_components/angular-sanitize/angular-sanitize.js',
      '../bower_components/smooch/dist/smooch.js',
      // endbower
      '../app/scripts/**/*.js',
      //'../test/mock/**/*.js',
      '../test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
