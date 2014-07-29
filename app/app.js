import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

import Base64 from "subledger-app/utils/Base64";

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: 'subledger-app', // TODO: loaded via config
  Resolver: Resolver
});

loadInitializers(App, 'subledger-app');

// add support for data attributes on views
Ember.View.reopen({
  init: function() {
    this._super();
    var self = this;

    // bind attributes beginning with 'data-'
    Ember.keys(this).forEach(function(key) {
      if (key.substr(0, 5) === 'data-') {
        self.get('attributeBindings').pushObject(key);
      }
    });
  }
});

// add client side export support to Highchart
(function (H) {
  H.Chart.prototype.clientSideExportPNG = function () {
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

  H.Chart.prototype.clientSideExportSVG = function () {
    var svg = this.getSVG();
    var svg_base64 = (new Base64()).encode(svg);

    var image = "data:image/octet-stream;base64," + svg_base64;

    // Save locally
    window.location.href = image;
  };
}(Highcharts));

export default App;
