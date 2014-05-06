export default Ember.View.extend({
  templateName: "report",
  progressStyle: "width: 0%;",

  keepTrackOfProgress: function() {
    var progress = this.get('controller').get('progress');
    this.set('progressStyle', "width: " + progress + "%;");

    if (progress === 100) {
      this.$().find('.report-view').prop('disabled', false);
    }
  }.observes('controller.progress'),

  didInsertElement: function() {
    // configure datepicker for atm
    this.$().find('.date-at').datetimepicker({});

    // hide progressbar and view button
    this.$().find('.progress').hide();
    this.$().find('.report-view').hide();

    // handle view button click
    this.$().find('.report-view').on('click', $.proxy(this.viewClicked, this));
  },

  submit: function(e) {
    e.preventDefault();
    e.stopPropagation();

    // show progress bar and hide go button
    this.$().find('.progress').show();
    this.$().find('.report-go').hide();
    this.$().find('.report-view').prop('disabled', true).show();

    // get from at
    var at = this.$().find('.date-at').data('DateTimePicker').getDate();

    // call render method on controller
    this.get('controller').send('render', at.toDate());
  },

  viewClicked: function(e) {
    e.preventDefault();
    this.get('controller').send('show');
  }
});
