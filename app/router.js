import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('logout');
  this.route('settings');

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

    this.route('chart');
  });

  this.resource('reports', function() {
  });

  this.resource('report-rendering', { path: 'report-rendering/:id' });
});

export default Router;
