export default Ember.View.extend({
  loadingFirstPage: true,

  autoScroller: function() {
    var previousHeight = $(".app-main-content").prop('scrollHeight');

    Ember.run.next($.proxy(function() {
      if (this.get('loadingFirstPage')) {
        this.scrollToTheBottom();
      } else {
        this.scrollTo(previousHeight);
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

  scrollTo: function(previousHeight) {
    var pos = $(".app-main-content").prop('scrollHeight') - previousHeight;
    $(".app-main-content").scrollTop(pos);
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
