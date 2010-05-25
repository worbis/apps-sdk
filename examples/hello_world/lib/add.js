function status() {
  var torrents = bt.torrent.all();
  for (var i in torrents) {
    var torrent = torrents[i];
    var name = torrent.properties.get('name');
    var progress = torrent.properties.get('progress');
    if ($(sprintf("li[ref=%s]", name)).length == 0)
      $("#torrent-list").append(
        sprintf('<li ref="%s">%s: %s</li>', name, name, progress));
  }
}

$(document).ready(function() {
  $("a").click(function() {
    bt.add.torrent(this.href, function(resp) {
      $("body").append(sprintf(
        "Tried to add %s. The status was: %s. " +
          "That means there was a %s adding it.",
        resp.url, resp.status, resp.message));

    });
    return false;
  });
  setInterval(status, 100);
});

