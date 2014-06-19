import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

import Util from "subledger-app/utils/util";
import Credential from "subledger-app/utils/Credential";

import Base64 from "subledger-app/utils/Base64";

var App = Ember.Application.extend({
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  LOG_TRANSITIONS: true,
  LOG_TRANSITIONS_INTERNAL: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'subledger-app',
  Resolver: Resolver
});

loadInitializers(App, 'subledger-app');

Ember.Application.initializer({
  name: "credential",

  initialize: function(container, application) {
    container.register('credential:current', Credential, { singleton: true });

    container.typeInjection('route', 'credential', 'credential:current');
    container.typeInjection('controller', 'credential', 'credential:current');
    container.typeInjection('view', 'credential', 'credential:current');    
    container.typeInjection('adapter', 'credential', 'credential:current');
  }
});

// add client side export support to Highchart
(function (H) {
  H.Chart.prototype.clientSideExportPNG = function (divId) {
    var svg = this.getSVG(),
        width = parseInt(svg.match(/width="([0-9]+)"/)[1]),
        height = parseInt(svg.match(/height="([0-9]+)"/)[1]),
        canvas = document.createElement('canvas');
    
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    
    if (canvas.getContext && canvas.getContext('2d')) {
      canvg(canvas, svg);
      
      var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 

      // Save locally
      window.location.href = image;

    } else {
      alert ("Your browser doesn't support this feature, please use a modern browser");
    }
  };

  H.Chart.prototype.clientSideExportSVG = function (divId) {
    var svg = this.getSVG();
    var svg_base64 = (new Base64()).encode(svg);

    var image = "data:image/octet-stream;base64," + svg_base64;

    // Save locally
    window.location.href = image;
  };
}(Highcharts));

export default App;