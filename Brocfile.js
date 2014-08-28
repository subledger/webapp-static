/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  //name: require('./package.json').name,

  fingerprint: {
    enabled: false, // UNTIL THIS IS FIXED https://github.com/rickharrison/broccoli-asset-rev/issues/18
    replaceExtensions: ['html', 'css', 'js', 'less']
  },

  //getEnvJSON: require('./config/environment')
});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

app.import("vendor/bootstrap/js/affix.js");
app.import("vendor/bootstrap/js/alert.js");
app.import("vendor/bootstrap/js/button.js");
app.import("vendor/bootstrap/js/carousel.js");
app.import("vendor/bootstrap/js/collapse.js");
app.import("vendor/bootstrap/js/dropdown.js");
app.import("vendor/bootstrap/js/modal.js");
app.import("vendor/bootstrap/js/scrollspy.js");
app.import("vendor/bootstrap/js/tab.js");
app.import("vendor/bootstrap/js/tooltip.js");
app.import("vendor/bootstrap/js/transition.js");
app.import("vendor/bootstrap/js/popover.js");

app.import("vendor/subledger-js-library/src/subledger.js");    

app.import("vendor/jquery-visible/jquery.visible.js");
app.import("vendor/moment/moment.js");
app.import("vendor/accounting/accounting.js");
app.import("vendor/bignumber.js/bignumber.js");
app.import("vendor/jquery-maskmoney/dist/jquery.maskMoney.js");
app.import("vendor/typeahead.js/dist/typeahead.bundle.js");    
app.import("vendor/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js");
app.import("vendor/seiyria-bootstrap-slider/js/bootstrap-slider.js");

app.import("vendor/highcharts-release/highcharts.src.js");
app.import("vendor/highcharts-release/modules/exporting.src.js");

app.import("vendor/canvg/rgbcolor.js"); 
app.import("vendor/canvg/canvg.js");

module.exports = app.toTree();
