export default Ember.View.extend({
  loadingFirstPage: true,

  autoScroller: function() {
    Ember.run.next($.proxy(function() {
      if (this.get('loadingFirstPage')) {
        this.scrollToTheBottom();
      } else {
        this.scrollToStartEntry();
      }
    }, this));
  }.observes('controller.@each'),

  loadNextPage: function() {
    var defer = Ember.RSVP.defer();

    defer.promise.then($.proxy(function() {
      Ember.run.next($.proxy(function() {
        if (this.isScrolledAtTop()) {
          this.loadNextPage();
          
        } else {
          this.set('loadingFirstPage', false);
        }
      }, this));
    }, this));

    this.get('controller').send('nextPage', defer);
  },

  isScrolledAtTop: function() {
    return $(".app-main-content").scrollTop() === 0;
  },

  scrollToTheBottom: function() {
    $(".app-main-content").scrollTop($(".app-main-content").prop('scrollHeight'));
  },

  scrollToStartEntry: function() {
    $(".app-main-content").scrollTop(this.$(".loading-more").prop('scrollHeight') + 30);
  },

  didInsertElement: function() {
    Ember.run.next($.proxy(function() {
      if (this.isScrolledAtTop()) {
        this.loadNextPage();
      }
    }, this));


    $(".app-main-content").on('scroll', $.proxy(function() {
      this.set('loadingFirstPage', false);

      if (this.isScrolledAtTop()) {        
        this.loadNextPage();
      }      
    }, this));
  },

  willDestroyElement: function() {
    $(".app-main-content").off('scroll');
  }
});
