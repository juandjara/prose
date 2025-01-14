var _ = require('underscore');

var Backbone = require('backbone');
var Repo = require('../models/repo');

var auth = require('../config');
var cookie = require('../cookie');

var util = require('../util');

module.exports = Backbone.Collection.extend({
  model: Repo,

  initialize: function(models, options) {
    _.bindAll(this);

    this.user = options.user;

    this.comparator = function(repo) {
      return -(new Date(repo.get('updated_at')).getTime());
    };
  },

  fetch: function(options) {
    options = _.clone(options) || {};

    var cb = options.success;
    var cb2 = options.complete;

    var complete = (function handleComplete(...args) {
      cb(...args);
      cb2();
    }).bind(this);

    var success = (function handleSuccess(res, statusText, xhr) {
      this.add(res);
      util.parseLinkHeader(xhr, {
        success: success,
        complete: complete
      });
    }).bind(this);

    Backbone.Collection.prototype.fetch.call(this, {
      error: options.error,
      success: (function(model, res, options) {
        util.parseLinkHeader(options.xhr, {
          success: success,
          error: complete
        });
      }).bind(this)
    });
  },

  url: function() {
    var id = cookie.get('id');
    var type = this.user.get('type');
    var path;

    switch(type) {
      case 'User':
        path = (id && this.user.get('id') === id) ? '/user' :
          ('/users/' + this.user.get('login'))
        break;
      case 'Organization':
        path = '/orgs/' + this.user.get('login');
        break;
    }

    return auth.api + path + '/repos?per_page=100&type=owner';
  }
});
