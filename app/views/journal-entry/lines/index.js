import Ember from 'ember';
import InfiniteScrollView from "subledger-app/mixins/infinite-scroll-view";

export default Ember.View.extend(InfiniteScrollView, {
  tagName: 'article',
  classNames: 'journal-entry',
  classNameBindings: ['collapsed', 'listItem'],

  layoutName: 'layouts/panel-with-header-and-body-table',
  templateName: 'journal-entry/lines/index',

  headerTemplateName: 'journal-entry/lines/header',
  bodyTemplateName: 'journal-entry/lines/body',

  collapsed: Ember.computed.alias('controller.collapsed'),
  collapsive: Ember.computed.alias('controller.collapsive'),

  timeAgoFromNowInterval: null,
  timeAgoFromNowLastUpdated: null,

  initialAction: function() {
    if (!this.get('listItem')) {
      if (this.get('controller').toArray().length === 0) {
        this.loadOlderPage();
      } else {
        this.scrollToBottom();
      }
    }
  }.on('didInsertElement'),  

  listItem: function() {
    return this.get('controller').get('parentController') !== null;
  }.property(),

  headerClasses: function() {
    return this.get('collapsed') ? 'header' : 'header hidden';
  }.property('collapsed'),

  bodyClasses: function() {
    return 'body';
  }.property('collapsed'),

  tableClasses: function() {
    return this.get('collapsed') ? 'table' : 'table hidden';
  }.property('collapsed'),

  timeAgoISO: function() {
    return this.get('controller').get('journalEntry').get('effectiveAt').toISOString();
  }.property('controller.journalEntry.effectiveAt'),

  timeAgoFromNow: function() {
    return moment(this.get('controller').get('journalEntry').get('effectiveAt')).fromNow();
  }.property('controller.journalEntry.effectiveAt', 'timeAgoFromNowLastUpdated'),

  collpasedObserver: function() {
    this.timeAgoPopup();

    if (this.get('collapsed') && this.get('listItem')) {
      if (this.get('controller').toArray().length === 0) {
        this.loadOlderPage();
      }
    }
  }.observes('collapsed'),

  timeAgoPopup: function() {
    if (this.get('collapsed')) {
      this.$('.time-ago').popover('destroy');

    } else {
      Ember.run.scheduleOnce('afterRender', this, function() {
        this.$(".time-ago").popover({
          trigger: 'click',
          placement: 'right',
          content: this.get('timeAgoISO'),
          container: this.$()
        });

        this.$(".time-ago").on('click', $.proxy(function(e) {
          e.preventDefault();
          e.stopPropagation();
        }, this));
      });      
    }
  },

  calculateTimeAgoFromNow: function() {
    this.set('timeAgoFromNowLastUpdated', new Date());
  },

  didInsertElement: function() {
    if (this.get('collapsive')) {
      // handle click to toggle collapsed state
      this.$('.header, .body').on("click", $.proxy(function(e) {
        e.preventDefault();
        this.get('controller').send('toggleCollapsed');
      }, this));
    }

    if (!this.get('collapsed')) {
      this.timeAgoPopup();
    }

    // dismiss popover on scroll
    this.$().parents().on('scroll', $.proxy(function() {
      if (this.$(".time-ago") !== undefined) {
        this.$(".time-ago").popover('hide');
      }
    }, this));

    if (this.get('collapsive')) {
      var interval = setInterval($.proxy(this.calculateTimeAgoFromNow, this), 10000);
      this.set('timeAgoFromNowInterval', interval);
    }
  },

  willDestroyElement: function() {
    clearInterval(this.get('timeAgoFromNowInterval'));
  }
});