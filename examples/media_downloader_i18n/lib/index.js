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
    $("#notification").text($.gt.gettext('Adding a torrent, please be patient...')).slideDown();
    bt.add.torrent(item.torrents[0].url, function(resp) {
      if (resp.message == 'success') {
        $("#notification").slideUp();
        $(".bar", elem).progressbar();
      } else {
        $("#notification").text($.gt.gettext('There was a problem adding the torrent.'));
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
    $("<button class='play'>"+$.gt.gettext("Play")+"</button>").appendTo(container).click(function() {
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
  $("head").append('<link id="lang" rel="gettext" href="lang/en/en.json" lang="en">');
  $("head").append('<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/base/jquery-ui.css" type="text/css" media="all">');
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
	  var lang = $(this).attr("name");
	  var link = $("link#lang");
	  link.attr("lang", lang);
	  link.attr("href", "lang/"+lang+"/"+lang+".js");
	  $.gt.load();
	  $.gt.setLang(lang);
	  render_languagebar();
  });
});

function render_languagebar(){
	var langs = {"fr":$.gt.gettext("French"), "en":$.gt.gettext("English"), "ja":$.gt.gettext("Japanese")}
	var link = $("link#lang");
	$("#other").html("");
	$.each(langs, function(i, item){
		if(i==link.attr("lang")) $("#current").html(sprintf($.gt.gettext("Current language: %s"), item));
		else $("#other").append(" <a class=\"lang\" href=# name=\""+i+"\">"+item+"</a> ");
	});
}
