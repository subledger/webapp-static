export default Ember.View.extend({
  loadingFirstPage: true,

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

  firstPageChecker: function() {
    this.set('loadingFirstPage', false);
  }.observes('controller.@each'),

  search: function() {
    this.set('loadingFirstPage', true);
    this.get('controller').send('search');
  },

  loadNextPage: function() {
    if (!this.get('controller').get('hasNextPage')) return;

    var defer = Ember.RSVP.defer();

    defer.promise.then($.proxy(function() {
      Ember.run.next($.proxy(function() {
        if (this.isScrolledAtBottom()) {
          this.loadNextPage();          
        }
      }, this));
    }, this));

    this.get('controller').send('nextPage', defer);
  },  

  isScrolledAtBottom: function() {
    var $content = $(".app-main-content");
    return $content.prop('scrollHeight') - $content.scrollTop() === $content.innerHeight();
  },  

  didInsertElement: function() {
    $(".app-main-content").on('scroll', $.proxy(function() {
      if (this.get('loadingFirstPage')) return;

      if (this.isScrolledAtBottom()) {
        this.loadNextPage();
      }
    }, this));
  }  
});