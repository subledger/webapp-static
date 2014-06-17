export default Ember.Mixin.create({
  showLoadingNewer: true,
  loadNewerPageIfNecessaryHandler: null,

  showLoadingNewerObserver: function() {
    Ember.run.once(this, function() {
      if (!this.$loadingNewer()) {
        this.set('showLoadingNewer', this.get('controller').get('loadingNewerPage'));
        return;
      }

      if (this.get('controller').get('loadingOlderPage')) {
        this.set('showLoadingNewer', false);

      } else if (!this.isScrollable()) {
        this.set('showLoadingNewer', this.get('controller').get('loadingNewerPage'));

      } else {
        this.set('showLoadingNewer', true);
      }
    });
  }.observes('controller.pagesLoaded', 'controller.loadingOlderPage', 'controller.loadingNewerPage'),

  $scroll: function() {
    return this.$('.infinite-scroll');
  },

  $noResults: function() {
    return this.$('.no-results');
  },

  $loadingOlder: function() {
    return this.$('.loading-older');
  },

  $loadingNewer: function() {
    return this.$('.loading-newer');
  },

  autoScroller: function() {
    if (this.get('controller').get('pagesLoaded') === 1) {
      // always scroll to bottom on first page loaded
      Ember.run.scheduleOnce('afterRender', this, function() {
        this.scrollToBottom().then($.proxy(this.loadNewerPageIfNecessary, this));
      });

      return;

    } else if (this.get('controller').get('loadedPageWas') === 'newer') {
      // if not first page and page was newer
      Ember.run.scheduleOnce('afterRender', this, function() {
        this.scrollToBottom().then($.proxy(this.loadNewerPageIfNecessary, this));
      });
      
    } else {
      // if not first page and page was older
      var previousHeight = this.scrollHeight();

      Ember.run.scheduleOnce('afterRender', this, function() {
        Ember.run.next(this, function() {
          var currentHeight = this.scrollHeight();
          var top = currentHeight - previousHeight;

          if (this.get('controller').get('hasOlderPage')) {
            top -= this.$loadingOlder().outerHeight();
          }

          this.scrollDown(top).then($.proxy(this.loadNewerPageIfNecessary, this));
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
    if (this.get('controller').toArray().length === 0 && this.get('controller').get('hasOlderPage')) {
      this.loadOlderPage();
    } else {
      this.scrollToBottom().then($.proxy(this.loadNewerPageIfNecessary, this));
    }
  }.on('didInsertElement'),

  unbindAutoScroller: function() {
    Ember.removeObserver(this, 'controller.@each', this, this.autoScroller);
  }.on('willDestroyElement'),

  destroyLoadNewerPageIfNecessaryHandler: function() {
    Ember.run.cancel(this.get('loadNewerPageIfNecessaryHandler'));
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
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      this.$scroll().scrollTop(newTopPosition);
      resolve();

    }, this));
  },

  scrollToTop: function() {
    return this.scrollTo(this.$loadingOlder().outerHeight());
  },

  scrollToBottom: function(callback) {
    return new Ember.RSVP.Promise($.proxy(function(resolve, reject) {
      Ember.run.next(this, function() {
        this.scrollTo(this.scrollHeight() - this.$scroll().height() - this.$loadingNewer().outerHeight()).then(
          $.proxy(function() {
            resolve();
          }, this)
        );
      });
    }, this));
  },

  scrollUp: function(amount) {
    return this.scrollTo(this.scrollCurrent() - amount);
  },

  scrollDown: function(amount) {
    return this.scrollTo(this.scrollCurrent() + amount);
  },

  isScrollable: function() {
    return this.scrollHeight() > this.$scroll().height() + 5;
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
  },

  loadNewerPageIfNecessary: function() {
    Ember.run.cancel(this.get('loadNewerPageIfNecessaryHandler'));

    var handler = Ember.run.later(this, function() {
      if (!this.isScrollable()) {
        this.get('controller').send('loadNewerPage');
      }
    }, 5000);

    this.set('loadNewerPageIfNecessaryHandler', handler);
  }
});