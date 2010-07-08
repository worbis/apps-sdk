/*
 * Base of the bt convenience object for creating apps.
 *
 * Copyright(c) 2010 BitTorrent Inc.
 *
 */

if (typeof(window.bt) == 'undefined') window.bt = {};

(function($) {
  $.ajaxSetup({
    beforeSend: function(xhr) {
    }
  });
  $(document).ajaxComplete(function(event, xhr, options) {
    console.log(xhr.getAllResponseHeaders());
  });
})(jQuery);

_.extend(bt, {

});
