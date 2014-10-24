/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  //name: require('./package.json').name,

  fingerprint: {
    // enabled: false, // UNTIL THIS IS FIXED https://github.com/rickharrison/broccoli-asset-rev/issues/18
    enbabled: true,
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

app.import("bower_components/bootstrap/js/affix.js");
app.import("bower_components/bootstrap/js/alert.js");
app.import("bower_components/bootstrap/js/button.js");
app.import("bower_components/bootstrap/js/carousel.js");
app.import("bower_components/bootstrap/js/collapse.js");
app.import("bower_components/bootstrap/js/dropdown.js");
app.import("bower_components/bootstrap/js/modal.js");
app.import("bower_components/bootstrap/js/scrollspy.js");
app.import("bower_components/bootstrap/js/tab.js");
app.import("bower_components/bootstrap/js/tooltip.js");
app.import("bower_components/bootstrap/js/transition.js");
app.import("bower_components/bootstrap/js/popover.js");

app.import("bower_components/subledger-js-library/src/subledger.js");

app.import("bower_components/jquery-visible/jquery.visible.js");
app.import("bower_components/moment/moment.js");
app.import("bower_components/accounting/accounting.js");
app.import("bower_components/bignumber.js/bignumber.js");
app.import("bower_components/jquery-maskmoney/dist/jquery.maskMoney.js");
app.import("bower_components/typeahead.js/dist/typeahead.bundle.js");
app.import("bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js");
app.import("bower_components/seiyria-bootstrap-slider/js/bootstrap-slider.js");

app.import("bower_components/highcharts-release/highcharts.src.js");
app.import("bower_components/highcharts-release/modules/exporting.src.js");

app.import("bower_components/canvg/rgbcolor.js");
app.import("bower_components/canvg/canvg.js");

module.exports = app.toTree();
