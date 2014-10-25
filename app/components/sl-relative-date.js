import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['sl-relative-date'],

  date: new Date(),
  updateInterval: 10000, // update every ten seconds
  dismissOnScroll: null, // selector to element bind dismiss on scroll

  // will be used to trigger a relativeDate refresh
  _lastUpdatedAt: 0,
  _updateIntervalHandler: null,

  relativeDate: function() {
    return moment(this.get('date')).fromNow();
  }.property('date', '_lastUpdatedAt'),

  isoDate: function() {
    return this.get('date').toISOString();
  }.property('date'),

  didInsertElement: function() {
    // schedule updates to the value
    var handler = setInterval($.proxy(function() {
      this.set('_lastUpdatedAt', new Date());
    }, this), this.get('updateInterval'));

    // save setInterval handler
    this.set('_updateIntervalHandler', handler);

    // create popover to display iso date
    this.$().popover({
      trigger: 'click',
      placement: 'right',
      content: this.get('isoDate'),
      container: this.$()
    }).on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
    });

    // dismiss popover on element scroll
    if (this.get('dismissOnScroll')) {
      $(this.get('dismissOnScroll')).on('scroll', $.proxy(function() {
        this.$().popover('hide');
      }, this));
    }
  },

  willDestroyElement: function() {
    // clear update interval
    if (this.get('_updateIntervalHandler')) {
      clearInterval(this.get('_updateIntervalHandler'));
    }

    // dismiss popover on element scroll
    if (this.get('dismissOnScroll')) {
      $(this.get('dismissOnScroll')).off('scroll');
    }
  }
});
