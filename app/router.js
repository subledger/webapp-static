var Router = Ember.Router.extend();

Router.map(function() {
  this.resource('login');
  this.resource('logout');

  this.resource('journal-entries', function() {
    this.route('new');
  });

  this.resource('journal-entry', { path: 'journal-entry/:id' }, function() {
    this.resource('journal-entry.lines', { path: '/lines' }, function() {
    });
  });

  this.resource('accounts', function() {
  });

  this.resource('account', { path: '/account/:account_id' }, function() {
    this.resource('account.lines', { path: '/lines' }, function() {
    });
  });

  this.resource('reports', function() {
  });

  this.resource('report-rendering', { path: 'report-rendering/:id' });
});

export default Router;