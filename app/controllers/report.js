export default Ember.ObjectController.extend({
  progress: 0,
  rendering: false,
  reportRendering: null,

  actions: {
    render: function(from, to) {
      this.renderProgress(from, to);
    },

    show: function() {
      this.transitionToRoute('report-rendering', this.get('reportRendering'));
    }
  },

  renderProgress: function(from, to, renderingId) {
    this.set('rendering', true);

    var query = {
      from: from,
      to: to,
      reportId: this.get('id'),
      id: renderingId
    };

    this.store.find('reportRendering', query).then($.proxy(function(reportRenderings) {
      var reportRendering = reportRenderings.get('firstObject');

      this.set('progress', reportRendering.get('progress').percentage);

      if (this.get('progress') === 100) {
        this.set('rendering', false);
        this.set('reportRendering', reportRendering);

      } else {
        this.renderProgress(from, to, reportRendering.get('id'));
      }
    }, this));
  }
});
