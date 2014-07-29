import Ember from 'ember';

export default Ember.ObjectController.extend({
  progress: 0,
  rendering: false,
  reportRendering: null,

  actions: {
    render: function(at) {
      this.renderProgress(at);
    },

    show: function() {
      this.transitionToRoute('report-rendering', this.get('reportRendering'));
    }
  },

  renderProgress: function(at, renderingId) {
    this.set('rendering', true);

    var query = {
      at: at,
      reportId: this.get('id'),
      id: renderingId
    };

    return this.store.find('reportRendering', query).then($.proxy(function(reportRenderings) {
      var reportRendering = reportRenderings.get('firstObject');

      var percentage = reportRendering.get('progress').percentage;

      if (percentage === 100) {
        this.setProperties({
          rendering: false,
          progress: percentage,
          reportRendering: reportRendering
        });

      } else {
        this.set('progress', percentage);
        return this.renderProgress(at, reportRendering.get('id'));
      }
    }, this));
  }
});
