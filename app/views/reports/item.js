export default Ember.View.extend({
  tagName: 'div',
  classNames: 'panel panel-default item hover-highlight',

  templateName: "reports/item",

  progressStyle: "width: 0%;",

  keepTrackOfProgress: function() {
    var progress = this.get('controller').get('progress');
    this.set('progressStyle', "width: " + progress + "%;");

    if (progress === 100) {
      this.$(".modal").modal('hide');      
    }
  }.observes('controller.progress'),  

  onItemClick: function(e) {
    e.preventDefault();
    e.stopPropagation();

    this.$(".modal").modal('show');  
  },  

  onReportGoClick: function(e) {
    e.preventDefault();
    e.stopPropagation();

    this.renderReport();
  },

  renderReport: function() {
    // show progress bar and disable go button
    this.$(".modal form .progress").show();
    this.$(".modal form .report-go").prop('disabled', true);

    // get from at
    var at = this.$(".modal form .date-at").data('DateTimePicker').getDate();

    // call render method on controller
    this.get('controller').send('render', at.toDate());
  },

  didInsertElement: function() {
    // configure modal
    this.$(".modal").modal({
      show: false
      
    }).on('hidden.bs.modal', $.proxy(function(e) {
      if (this.get('controller').get('progress') === 100) {
        this.get('controller').send('show');
      }
    }, this));

    // configure datepicker
    this.$(".modal form .date-at").datetimepicker({
      defaultDate: new Date()
    });

    // hide progressbar
    this.$(".modal form .progress").hide();

    // bind buttons
    this.$(".panel-body").on('click', $.proxy(this.onItemClick, this));
    this.$(".modal form .report-go").on('click', $.proxy(this.onReportGoClick, this));
  },

  willDestroyElement: function() {
    this.$(".item").off('click', $.proxy(this.onItemClick, this));
    this.$(".modal form .report-go").off('click', $.proxy(this.onReportGoClick, this));    
  }

});
