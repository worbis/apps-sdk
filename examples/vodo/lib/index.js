/*
 * Griffin vodo loader
 *
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 *
 * Date: %date%
 * Version: %version%
 *
 */

var mp = { }, mpmetrics = { };

(function() {
  $(document).ready(function() {
    mp = new MixpanelLib('7cbc4a8c3de93dd166be6b6b5b88e865');
    mpmetrics = mp;
    vodo.parse_url();
    _.delay(_.compose(vodo.render_releases, vodo.event.sort_date,
                      vodo.api.poll), 1);
    $("#login").click(function() { $("#login-dialog").dialog(); });
    $("#logout").click(vodo.event.logout);
    $("#login-dialog form").submit(vodo.event.login);
    // Get the releases up as fast as possible, refresh them later.
    $.getJSON(
      vodo.root + "releases/all?callback=?",
      function(items) {
        bt.stash.set('items', items);
        $("#datesort").click(vodo.event.sort_date);
        $("#titlesort").click(vodo.event.sort_title);
        vodo.render_releases();
        //vodo.api.list(vodo.check_progress);
      });
  });
})();
