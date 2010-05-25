$(document).ready(function() {
  $("a").click(function() {
    bt.add.torrent(this.href, function(resp) {
      console.log(resp);
      $("body").append(sprintf(
        "Tried to add %s. The status was: %s. " +
          "That means there was a %s adding it.",
        resp.url, resp.status, resp.message));
    });
    return false;
  });
  var my_torrent = bt.torrent.get('http://releases.ubuntu.com/10.04/ubuntu-10.04-desktop-i386.iso.torrent');
  $("#status").text(my_torrent.properties.get('progress') / 10);
});

