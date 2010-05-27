/*
 * Griffin vodo object.
 *
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 *
 * Date: %date%
 * Version: %version%
 *
 */

var vodo = {
  root: 'http://vodo.net/jsonp/',
  file_types: [ 'avi', 'mkv' ],
  log: function(msg) {
    $("body").prepend("<div>"+msg+"</div>");
  },
  format_seconds: function(secs) {
    var date = new Date(secs * 1000);
    var hours = date.getUTCHours();
    var mins = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    return (hours ? hours + "h " : "") + (mins ? mins + "m " : "") +
      (seconds ? seconds + "s" : "");
  },
  _setup_release: function(item, item_obj) {
    $(".Description", item_obj).addClass('current-nav');
    $(".comments form", item_obj).submit(vodo.event.submit_comment);
    $(".overview", item_obj).toggle(vodo.event.show_detail,
                                    vodo.event.hide_detail);
    $(".download-button", item_obj).click(vodo.event.add_torrent);
    $(".play-button", item_obj).click(vodo.event.play_file);
    $(".download a:last", item_obj).addClass('default-download');
    $(".download a", item_obj).click(vodo.event.switch_default);
    $(".donate-detail li", item_obj).click(vodo.event.record_donation);
    item_obj.data('date', item.published);
  },
  _releases: function(items) {
    var item = items.shift();
    if ($("body").data(item.id.toString())) {
      if (items.length == 0)
        return _.delay(vodo._finalize, 1);
      return _.delay(vodo._releases, 1, items);
    }
    $("body").data(item.id.toString(), true);
    var release_html = bt.stash.get(item.id.toString(), '');
    if (release_html)
      var item_obj = $('<li class="release">'+release_html+'</li>');
    else {
      var item_obj = $(Jaml.render('vodo.release', item));
      bt.stash.set(item.id.toString(), item_obj.html());
    }
    item_obj.data('item', item);
    _.each(['Description', 'Author', 'Comments', 'Donate'], function(i) {
      $('.'+i, item_obj).click(_.bind(vodo.event.show, item_obj, i));
    });
    vodo._setup_release(item, item_obj);
    $("#releases").append(item_obj);
    if (items.length == 0)
      return _.delay(vodo._finalize, 1);
    return _.delay(vodo._releases, 1, items);
  },
  _finalize: function() {
    vodo.event.sort_date();
    if (bt.stash.get('userid', -1) > 0)
      vodo.event._login_success(bt.stash.get('userid', -1));
  },
  render_releases: function() {
    try {
      var items = bt.stash.get('items');
    } catch(err) { return };
    var rel_dom = $("#releases");
    // Handle the promo specially. Keep it in the whole list anyways.
    var promo = _.filter(items, function(v) { return v.promo === true; })[0];
    $("#promo").data('item', promo);
    if (promo.description != $("#promo .descr").text()) {
      $("#promo").css('background-image', 'url("' + promo.promoimg + '")');
      $("#promo .links a").detach();
      $("#promo .links ul:last").html(Jaml.render('vodo.release.links',
                                             promo.torrents));
      $("#promo .descr").text(promo.description);
      $("#promo h2").append(promo.title);
      vodo._setup_release(promo, $("#promo"));
    }
    vodo._releases(_.filter(items, function(v) {
      return v.promo != true;
    }));
  },
  description_summary: function(descr) {
    return descr.slice(0, 32);
  },
  parse_url: function() {
    var qs = { };
    try {
      _.each(document.location.href.split('?')[1].split('&'), function(i) {
        var separated = i.split('=');
        qs[separated[0]] = separated[1];
      });
    } catch(err) { qs.port = '123'; qs.pair = 'ASDF' };
    $("body").data('url',
                   'http://127.0.0.1:'+qs.port+'/gui/?token='+qs.pair+
                   '&pairing='+qs.pair);
  },
  request: function(data, success, error) {
    jQuery.ajax({
      url: $("body").data("url"),
      data: data,
      dataType: "jsonp",
      success: success,
      error: error
    });
  },
  check_progress: function(torrents) {
    $("#promo, .release").each(function(k, v) {
      var item = $(v).data('item');
      if (!item) return
      var tor_info = _.filter(torrents, function(t) {
        return _(item.torrents).chain().pluck('hash').filter(function(z) {
          return z === t.hash.toLowerCase().slice(1);
        }).value().length > 0;
      });
      if (!tor_info || tor_info.length == 0)
        return
      $('.links-toggle', this).hide();
      // Display a progress bar if the progress is less than 100%
      if (tor_info[0].properties.get('progress')/10 !== 100) {
        $('.download-button', v).hide();
        $('.progressbar', v).progressbar(
          { value: tor_info[0].properties.get('progress')/10 }).show();
        return
      }
      // Display a "Play" button that launches the default media player if the
      // torrent is completely downloaded.
      if ($(".play-button", v).css('display') != 'none')
        return
      $(".download-button", v).hide();
      $(".play-button", v).show();
      $(".progressbar", v).hide();
    });
  },
  event: {
    setActive: function(item, link) {
      $(".detail li a", item).removeClass('current-nav');
      $('.'+link, item).addClass('current-nav');
    },
    setSort: function(sort) {
      $("#list-title a").removeClass('current-sort');
      $("#"+sort+"sort").addClass('current-sort');
    },
    show: function(section) {
      var item = $(this).closest('.release');
      mp.track('release.detail', {
        name: $(".title", item).text(),
        section: section,
        userid: bt.stash.get('userid', -1)
      });
      $(".canvas > li", this).hide();
      $("." + section.toLowerCase(), this).show();
      $(".detail", this).show();
      vodo.event.setActive(this, section);
      return false;
    },
    show_detail: function() {
      var item = $(this).closest('.release');
      mp.track('release.detail', {
        name: $(".title", item).text(),
        section: 'expand',
        userid: bt.stash.get('userid', -1)
      });
      $(".detail", item).slideDown('fast');
      $(".release-toggle", item).text('-');
      return false;
    },
    hide_detail: function() {
      var item = $(this).closest('.release');
      $(".detail", item).slideUp('fast');
      $(".release-toggle", item).text('+');
      return false;
    },
    sort_date: function() {
      vodo.event.setSort('date');
      $("#releases li.release").sort_elements(function(a, b) {
        return $(a).data('date') < $(b).data('date') ? 1 : -1 ;
      });
    },
    sort_title: function() {
      vodo.event.setSort('title');
      $("#releases li.release").sort_elements(function(a, b) {
        return $(".title", a).text() > $(".title", b).text() ? 1 : -1;
      });
    },
    add_torrent: function() {
      var item = $(this).closest('.release, #promo');
      var obj = item.data('item');
      mp.track('torrent.add',
                { name: $('.title', item).text(),
                  type: $('.default-download', item).text(),
                  userid: bt.stash.get('userid', -1) });
      var tor = $('.default-download', item).attr('href');
      btapp.add.torrent(tor);
      // If an object in the list that is also a promo was
      // clicked, hide the bars
      if (obj.promo) {
        $("#promo .links-toggle").hide();
        $("#promo .download-button").hide();
        $("#promo .progressbar").progressbar().show();
      }
      // If an object that is the promo was clicked, hide it in
      // the list too.
      if (item[0].id == 'promo')
        item = _.filter($(".release"), function(v) {
          return $(v).data('item').promo });
      $('.links-toggle', item).hide();
      $(".download-button", item).hide();
      $('.progressbar', item).progressbar().show();
      return false;
    },
    _login_success: function(userid, token) {
      mp.track('login', { userid: userid });
      $("#login-dialog").dialog('close');
      $("#login-failure").hide();
      bt.stash.set('userid', userid);
      bt.stash.set('token', token);
      $("#login").hide();
      $("#logout").show();
      $(".comments form").show();
    },
    _login_failure: function() {
      $("#login-failure").show();
    },
    login: function() {
      $.ajax({
        url: vodo.root + 'login',
        data: {
          username: this.username.value,
          password: this.password.value
        },
        dataType: 'jsonp',
        success: function(resp) {
          if (resp.success)
            return vodo.event._login_success(resp.userid, resp.token);
          return vodo.event._login_failure();
        }
      });
      return false;
    },
    logout: function() {
      $.getJSON(vodo.root + 'logout?callback=?',
                function(resp) {
                  mp.track('logout', { userid: bt.stash.get('userid', -1) });
                  bt.stash.set('userid', -1);
                  $(".comments form").hide();
                  $("#logout").hide();
                  $("#login").show();
                });
      return false;
    },
    submit_comment: function() {
      var self = this;
      var item = $(this).closest('.release');
      var item_data = item.data('item');
      var userid = bt.stash.get('userid', -1);
      mp.track('comment.submit', {
        userid: userid,
        name: $('.title', item).text()
      });
      $.ajax({
        url: vodo.root + 'comments/save',
        data: {
          userid: userid,
          token: bt.stash.get('token'),
          workid: item_data.id,
          body: $("textarea", this).val()
        },
        dataType: 'jsonp',
        success: function(resp) {
          $("textarea", self).val('');
          $("#msg").text("Comment submitted.").show();
        }
      });
      return false;
    },
    switch_default: function() {
      var item = $(this).closest('.release, #promo');
      $(".download a", item).toggleClass('default-download');
      return false;
    },
    record_donation: function() {
      mp.track('donation', {
        userid: bt.stash.get('userid', -1),
        amount: $(this).attr('class').split('-')[1]
      });
    },
    play_file: function() {
      var item = $(this).closest('.release, #promo');
      var data = item.data('item');
      mp.track('torrent.play',
               { name: $(".title", item).text(),
                 userid: bt.stash.get('userid', -1) });
      _(btapp.torrent.all()).chain().filter(function(v) {
        return _(data.torrents).chain().pluck('hash').filter(function(z) {
          return z === v.hash.toLowerCase().slice(1);
        }).value().length > 0;
      }).each(function(v) {
        var playable = _(v.file.all()).chain().filter(function(v, k) {
          for (var i=0; i < vodo.file_types.length; i++)
            if (k.indexOf(vodo.file_types[i]) == k.length-3)
              return true
          return false
        }).values().value();
        if (playable.length == 0)
          $("#playable").dialog();
        $(playable).sort(function(a,b) {
          return b.properties.get('size') > a.properties.get('size');
        })[0].open();
      });
      return false;
    }
  },
  api: {
    _list_map: {
      0: 'hash',
      2: 'name',
      4: 'progress'
    },
    _parse_list: function(resp) {
      var torrents = _.map(resp.torrents, function(elem) {
        var tor = { };
        _.each(elem, function(v, i) {
          if (!(i in vodo.api._list_map))
            return
          tor[vodo.api._list_map[i]] = v;
        });
        return tor;
      });
      return torrents;
    },
    list: function(cb) {
      vodo.request({ list: 1, getmsg: 1 }, _.compose(cb, vodo.api._parse_list));
    },
    poll: function() {
      function poll() {
        vodo.check_progress(btapp.torrent.all());
      }
      poll();
      setInterval(poll, 1000);
    }
  }
};
