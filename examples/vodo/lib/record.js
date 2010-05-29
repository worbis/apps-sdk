/*
 * Record interactions with javascript objects and functions.
 *
 * Dependencies:
 *     underscore.js
 *     json2.js (in IE)
 */

var mimic = {
  history: {},
  get_history: function(k) {
    if (k in mimic.history) return mimic.history[k];
    mimic.history[k] = [];
    return mimic.history[k];
  },
  _wrap: function(wrapper, root, priv, not_recursive) {
    function inspect(obj, path) {
      _.each(obj, function(v, k) {
        if (!priv && k.match(/^_.*/)) return
        var current_path = path ? path + '.' + k : k;
        if (_.isFunction(v)) {
          obj[k] = _.wrap(v, _.bind(wrapper, this, current_path));
          return
        }
        if (!not_recursive) return inspect(v, current_path);
      });
    }
    inspect(root);
  },
  record: function(root, priv, not_recursive) {
    mimic._wrap(mimic._report, root, priv, not_recursive);
  },
  replay: function(root, priv, not_recursive) {
    mimic._wrap(mimic._stub, root, priv, not_recursive);
  },
  save: function(url) {
    $.post(url, JSON.stringify(mimic.history));
  },
  fetch: function(fname) {
    $.get('http://localhost:8080/test/' + fname, function(v) {
      mimic.history = JSON.parse(v);
    });
  },
  _report: function(name, fn) {
    var args = _.toArray(arguments).slice(2);
    var resp = fn.apply(this, args);
    mimic.get_history(name).push({ resp: resp, args: args });
    return resp;
  },
  _stub: function(name, fn) {
    var resp = mimic.get_history(name).pop()
    if (!resp)
      return fn.apply(this, _.toArray(arguments).slice(2));
    return resp['resp'];
  }
};
