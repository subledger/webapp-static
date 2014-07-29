import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'div',
  classNames: 'index',
  layoutName: 'layouts/header-and-rightnav',
  headerName: 'reports/index/header',
  rightNavName: 'reports/index/right-nav',
  contentClasses: 'infinite-scroll',

  loadingFirstPage: true,

  init: function() {
    this._super();
    this.set('loadingFirstPage', new Date());
  },

  keyUp: function() {
    this.search();
  },

  click: function(e) {
    e.preventDefault();

    var $el = $(e.target);
    if ($el.hasClass('browse')) {
      var query = $el.data('query');

      if ($el.data('type') === 'hex') {        
        this.get('controller').set('description', String.fromCharCode(query));
      } else {
        this.get('controller').set('description', query);
      }

      // search
      this.search();

      // set focus on input
      this.$(".description").focus();
    }
  },

  onScrollHandler: function() {
    if (this.get('loadingFirstPage')) { return; }

    if (this.isScrolledAtBottom()) {
      this.loadNextPage();
    }
  },

  firstPageChecker: function() {
    this.set('loadingFirstPage', false);
  }.observes('controller.@each'),

  isScrolledAtBottom: function() {
    var $content = this.$(".content");
    var diff = $content.prop('scrollHeight') - $content.scrollTop();

    return diff === $content.innerHeight();
  },   

  search: function() {
    this.set('loadingFirstPage', true);
    this.get('controller').send('search');
  },

  loadNextPage: function() {
    if (!this.get('controller').get('hasNextPage')) { return; }

    var defer = Ember.RSVP.defer();

    defer.promise.then($.proxy(function() {
      Ember.run.next(this, function() {
        if (this.isScrolledAtBottom()) {
          this.loadNextPage();          
        }
      });
    }, this));

    this.get('controller').send('nextPage', defer);
  },

  didInsertElement: function() {
    this.$(".content").on('scroll', Ember.run.bind(this, this.onScrollHandler));
  },

  willDestroyElement: function() {
    this.$(".content").off('scroll');
  }
});