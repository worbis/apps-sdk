var languages = {"fr":"French", "en":"English", "ja":"Japanese"};
var b_gt;

function render_item(item) {
  item.torrents[0].url = item.torrents[0].url.replace(/ /g, '');
  if ($(sprintf("li a[href=%s]", item.torrents[0].url)).length > 0)
    return
  var template = [ "li", [ "a", { "href": "{{url}}" }, "{{title}}" ],
                   ["div", { "class": "bar" } ] ];
  var elem = $(JUP.html({ url: item.torrents[0].url, title: item.title },
                        template));
  $("#items").append(elem);
  $("a", elem).click(function() {
    $("#notification").text(b.gettext('Adding a torrent, please be patient...')).slideDown();
    bt.add.torrent(item.torrents[0].url, function(resp) {
      if (resp.message == 'success') {
        $("#notification").slideUp();
        $(".bar", elem).progressbar();
      } else {
        $("#notification").text(b.gettext('There was a problem adding the torrent.'));
      }
    });
    return false;
  });
}

function update_progress() {
  var torrents = bt.torrent.all();
  for (var i in torrents) {
    var tor = torrents[i];
    var container = $(
      sprintf("li a[href=%s]", tor.properties.get('download_url'))
    ).closest('li');
    var progress = tor.properties.get('progress') / 10;
    if (progress != 100) {
      $(".bar", container).progressbar({ value: progress });
      continue
    }
    if ($(".play", container).length > 0)
      continue
    $(".bar", container).hide();
    $("<button class='play'>"+b.gettext("Play")+"</button>").appendTo(container).click(function() {
      var files = tor.file.all();
      var f;
      for (var i in files) {
        if (!f || f.properties.get('size') > files[i].properties.get('size'))
          f = files[i];
      }
      f.open();
    });
  }
}

$(document).ready(function() { 
  var link_template = ["link", {"class":"lang", "rel":"gettext", "href":"lang/"+"{{l}}"+"/"+"{{l}}"+".po", "lang":"{{l}}"}];
  $.each(languages, function(i, item){
	$("head").append($(JUP.html({ l:i }, link_template)));
  });
  $("head").append('<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/base/jquery-ui.css" type="text/css" media="all">');
  b_gt = new bt.Gettext();
  $.getJSON('http://vodo.net/jsonp/releases/all?callback=?', function(items) {
    bt.stash.set('items', items);
    for (var i = 0, ii = items.length; i < ii; i++)
      render_item(items[i]);
  });
  setInterval(update_progress, 100);

  var items = bt.stash.get('items', []);
  for (var i=0; i < items.length; i++) {
    render_item(items[i]);
  }
  render_languagebar();
  $("a.lang").live('click', function(){
	  b_gt.lang = $(this).attr("name");
	  render_languagebar();
  });
});
function render_languagebar(){
	$("#other").html("");
	$.each(languages, function(i, item){
		if(i==b_gt.lang){
			var langstr = b_gt.gettext(item);
			$("#current").html(b_gt.gettext("Current language: %s", langstr));
		}else {
			$("#other").append(" <a class=\"lang\" href=# name=\""+i+"\">"+b_gt.gettext(item)+"</a> ");
		}
	});
	$("#notification").text(b_gt.gettext($("#notification").text()));
}
