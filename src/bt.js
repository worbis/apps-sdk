/*
 * Base of the bt convenience object for creating Griffin applications
 *
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 *
 * Date: %date%
 * Version: %version%
 *
 */

var bt = {
  
};

(function() {
  // If btapp exists, this is running natively, so don't replace anything.
  if (window.btapp)
    return

  window.btapp = {
    stash: {
      all: function() { return btapp.stash._data }
    },
  };
})();
