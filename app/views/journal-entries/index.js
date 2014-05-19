export default Ember.View.extend({
  tagName: 'div',
  classNames: 'content',

  autoScroller: function() {
    if (this.$()) {
      var previousHeight = this.$().prop('scrollHeight');

      Ember.run.next(this, function() {
        this.scrollTo(previousHeight + 15);
      });
    }
  }.observes('controller.@each'),

  loadNextPage: function() {
    var defer = Ember.RSVP.defer();

    defer.promise.then($.proxy(function() {
      Ember.run.next(this, function() {
        if (this.isScrolledAtTop()) {
          this.loadNextPage();
        }
      });
    }, this));

    this.get('controller').send('nextPage', defer);
  },

  isScrolledAtTop: function() {
    return this.$().scrollTop() === 0;
  },

  scrollToTheBottom: function() {
    this.$().scrollTop(this.$().prop('scrollHeight'));
  },

  scrollTo: function(previousHeight) {
    var pos = this.$().prop('scrollHeight') - previousHeight;
    this.$().scrollTop(pos);
  },

  didInsertElement: function() {
    if (this.get('controller').toArray().length === 0) {
      this.loadNextPage();
    } else {
      this.scrollToTheBottom();
    }

    this.$().on('scroll', $.proxy(function() {
      if (this.isScrolledAtTop()) {        
        this.loadNextPage();
      }      
    }, this));
  },

  willDestroyElement: function() {
    this.$().off('scroll');
  }
});
