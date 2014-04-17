export default Ember.View.extend({
  templateName: "report",
  progressStyle: "width: 0%;",

  keepTrackOfProgress: function() {
    var progress = this.get('controller').get('progress');
    this.set('progressStyle', "width: " + progress + "%;");

    if (progress === 100) {
      this.$().find('.report-view').show();
    }
  }.observes('controller.progress'),

  didInsertElement: function() {
    // configure datepicker for from
    this.$().find('.date-from').datetimepicker({});

    // configure datepicker for to
    this.$().find('.date-to').datetimepicker({});

    // hide progressbar and view button
    this.$().find('.progress').hide();
    this.$().find('.report-view').hide();

    // handle view button click
    this.$().find('.report-view').on('click', $.proxy(this.viewClicked, this));
  },

  submit: function(e) {
    e.stopPropagation();

    // show progress bar and hide go button
    this.$().find('.progress').show();
    this.$().find('.report-go').hide();

    // get from date
    var from = this.$().find('.date-from').data('DateTimePicker').getDate();

    // get to date
    var to = this.$().find('.date-to').data('DateTimePicker').getDate();

    // call render method on controller
    this.get('controller').send('render', from.toDate(), to.toDate());
  },

  viewClicked: function(e) {
    e.stopPropagation();
    this.get('controller').send('show');
  },

});