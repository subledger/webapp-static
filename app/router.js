var Router = Ember.Router.extend();

Router.map(function() {
  this.resource('login');

  this.resource('journal-entries', function() {
    this.route('new');
  });

  this.resource('journal-entry', { path: 'jorunal-entry/:id' });

  this.resource('account', { path: '/account/:account_id' }, function() {
    this.resource('lines', function() {
    });
  });

  this.resource('reports');

  this.resource('report-rendering', { path: 'report-rendering/:id' });
});

export default Router;