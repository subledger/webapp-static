export default Ember.View.extend({
  loadingFirstPage: true,
  updateBalanceHandler: null,

  init: function() {
    this._super();
    this.set('loadingFirstPage', new Date());
  },

  updateBalanceObserver: function() {
    this.balancesUpdater();
  }.observes('controller.@each'),

  keyUp: function(e) {
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
    // run balance updater
    this.balancesUpdater();

    if (this.get('loadingFirstPage')) return;

    if (this.isScrolledAtBottom()) {
      this.loadNextPage();
    }
  },

  firstPageChecker: function() {
    this.set('loadingFirstPage', false);
  }.observes('controller.@each'),

  isScrolledAtBottom: function() {
    var $content = $(".app-main-content");
    var diff = $content.prop('scrollHeight') - $content.scrollTop();

    return diff === $content.innerHeight();
  },   

  search: function() {
    this.set('loadingFirstPage', true);
    this.get('controller').send('search');
  },

  loadNextPage: function() {
    if (!this.get('controller').get('hasNextPage')) return;

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

  balancesUpdater: function() {
    // cancel previous updateBalance
    Ember.run.cancel(this.get('updateBalanceHandler'));

    var handler = Ember.run.later(this, function() {
      var childViews = this.get('childViews');

      childViews.forEach(function(childView) {
        if (childView.updateBalance) {
          childView.updateBalance();
        }
      }, this);
    }, 2000);

    // update handler reference
    this.set('updateBalanceHandler', handler);
  },

  didInsertElement: function() {
    $(".app-main-content").on('scroll', Ember.run.bind(this, this.onScrollHandler));
  }  
});