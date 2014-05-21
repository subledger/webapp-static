export default Ember.View.extend({
  tagName: 'div',
  classNames: 'full-content',

  autoScroller: function() {
    if (!this.get('controller').get('loadedPageWasNewer')) {
      if (this.$()) {
        var previousHeight = this.$(".content").prop('scrollHeight');

        Ember.run.scheduleOnce('afterRender', this, function() {
          this.scrollTo(previousHeight + 15);
        });
      }
    } else {
      Ember.run.scheduleOnce('afterRender', this, function() {
        this.scrollToTheBottom();
      });
    }
  }.observes('controller.@each'),

  onStateChange: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.loadNextPage();
    });
  }.observes('controller.selectedState'),

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
    return this.$(".content").scrollTop() === 0;
  },

  scrollToTheBottom: function() {
    this.$(".content").scrollTop(this.$(".content").prop('scrollHeight'));
  },

  scrollTo: function(previousHeight) {
    var pos = this.$(".content").prop('scrollHeight') - previousHeight;
    this.$(".content").scrollTop(pos);
  },

  didInsertElement: function() {
    if (this.get('controller').toArray().length === 0) {
      this.loadNextPage();
    } else {
      this.scrollToTheBottom();
    }

    this.$(".content").on('scroll', $.proxy(function() {
      if (this.isScrolledAtTop()) {        
        this.loadNextPage();
      }      
    }, this));
  },

  willDestroyElement: function() {
    this.$().off('scroll');
  }
});
