export default Ember.Mixin.create({
  $scroll: function() {
    return this.$('.infinite-scroll');
  },

  $loadingOlder: function() {
    return this.$('.loading-older');
  },

  $loadingNewer: function() {
    return this.$('.loading-newer');
  },

  autoScroller: function() {
    if (this.get('controller').get('pagesLoaded') === 1) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        this.scrollToBottom();
      });

      return;
    }

    if (this.get('controller').get('loadedPageWas') === 'newer') {
      Ember.run.scheduleOnce('afterRender', this, function() {
        this.scrollToBottom();
      });
      
    } else {
      var previousHeight = this.scrollHeight();

      Ember.run.scheduleOnce('afterRender', this, function() {
        Ember.run.next(this, function() {
          var currentHeight = this.scrollHeight();
          var top = currentHeight - previousHeight;

          if (this.get('controller').get('hasOlderPage')) {
            top -= this.$loadingOlder().outerHeight();
          }

          this.scrollDown(top);
        });
      }); 
    }
  },

  bindAutoScroller: function() {
    Ember.addObserver(this, 'controller.pagesLoaded', this, this.autoScroller);
  }.on('didInsertElement'),

  bindOnScrollHandlers: function() {
    this.$scroll().on('scroll', $.proxy(function(e) {
      if (this.isScrolledToTop()) {
        this.loadOlderPage();

      } else if (this.isScrolledToBottom()) {
        this.loadNewerPage();
      }
    }, this));
  }.on('didInsertElement'),

  initialAction: function() {
    if (this.get('controller').toArray().length === 0) {
      this.loadOlderPage();
    } else {
      this.scrollToBottom();
    }  
  }.on('didInsertElement'),

  unbindAutoScroller: function() {
    Ember.removeObserver(this, 'controller.@each', this, this.autoScroller);
  }.on('willDestroyElement'),  

  unbindOnScrollHandlers: function() {
    this.$scroll().off('scroll');
  }.on('willDestroyElement'),

  scrollHeight: function() {
    return this.$scroll().prop('scrollHeight');
  },

  scrollCurrent: function() {
    return this.$scroll().scrollTop();
  },

  scrollTo: function(newTopPosition) {
    this.$scroll().scrollTop(newTopPosition);
  },

  scrollToTop: function() {
    this.scrollTo(this.$loadingOlder().outerHeight());
  },

  scrollToBottom: function() {
    Ember.run.next(this, function() {
      this.scrollTo(this.scrollHeight() - this.$scroll().height() - this.$loadingNewer().outerHeight());  
    });    
  },

  scrollUp: function(amount) {
    this.scrollTo(this.scrollCurrent() - amount);
  },

  scrollDown: function(amount) {
    this.scrollTo(this.scrollCurrent() + amount);
  },

  isScrolledToTop: function() {
    return this.scrollCurrent() <= 5;
  },

  isScrolledToBottom: function() {
    return this.scrollHeight() - this.scrollCurrent() - 5 <= this.$scroll().height();
  },

  loadOlderPage: function() {
    this.get('controller').send('loadOlderPage');
  },

  loadNewerPage: function() {
    this.get('controller').send('loadNewerPage');
  }
});