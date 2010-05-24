This is a tutorial that will introduce consumption of remote resources from
within an application as well as how to make the application feel a little more
like a native application than a web page. If you're looking for something to
just get started off, take a look at [Hello
World](http://github.com/bittorrent/griffin/tree/master/doc/tutorials/hello_world.md)
first.

If, at any time you'd like to see a complete version of the app that this
tutorial builds, take a look at [Media
Downloader](http://github.com/bittorrent/griffin/tree/master/examples/media_downloader).

# Setup

To setup your project directory:

    % python -m griffin.setup media_downloader
    % cd media_downloader
    % python -m griffin.add http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/jquery-ui.js

Since this is all about downloading media, let's get the main page setup to
have a list of content. Open `html/index.html` in the media_downloader
directory and replace what's there with:

    <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/base/jquery-ui.css" type="text/css" media="all">
    <ul id="items"></ul>

Now, open `lib/list.js` so that we can add some javascript to populate that
list.


    function render_item(item) {
        var elem = $('<li><a href="'+item.torrents[0].url+'">'+
                     item.title + '</a></li>');
        $("#items").append(elem);
    }

    $(document).ready(function() {
        $.getJSON('http://vodo.net/jsonp/releases/all?callback=?', function(items) {
            for (var i = 0, ii = items.length; i < ii; i++)
                render_item(items[i]);
        });
    }

Run your application in debug mode via. `python -m griffin.serve` and take a
look in your browser. You should see a list of links with the torrent title.

To make it so any of these torrents can be added to your client, let's add a
line to `render_item` in `lib/list.js`:

    elem.click(function() {
        bt.add.torrent(item.torrents[0].url);
        return false;
    });

Take a couple minutes to see how this looks in your browser. Now, let's test
the app in your client. Run:

    % zip -r ../media_downloader.btapp .

And, double click on the `media_downloader.btapp` file. In your client, take a
look at the application and try to add some torrents.

Now, let's make the app reflect that a torrent was actually started
downloading. Replace the render item function in `lib/list.js` with:

    function render_item(item) {
        var elem = $('<li><a href="'+item.torrents[0].url+'">'+
                     item.title + '</a></li>');
        $("#items").append(elem);
        elem.click(function() {
            bt.add.torrent(item.torrents[0].url, function(resp) {
                if (resp.message == 'success') {
                    elem.append("<div class='bar'></div>");
                    $(".bar", elem).progressbar();
                }
            });
            return false;
        });
    }

That callback at the end of bt.add.torrent allows notification of when a
specific torrent was added (or failed to be added). While status notifications
can take callbacks, progress updates do not use callbacks (as they'd be
happening too often). To poll the torrent's progress and update progress bars,
there will need to be a little more code. Just add it at the bottom of
`lib/list.js`.

    function update_progress() {
        var torrents = bt.torrent.all();
        for (var i in torrents) {
            var container = $(
                "li a[href=" + torrents[i].properties.get('download_url') + "]"
            ).closest('li');
            $(".bar", container).progressbar(
                { value: torrents[i].properties.get('progress') / 10 });
        }
    }

Then, inside the `$(document).ready()` function, add:

    setInterval(update_progress, 100);

Take a little time to play with this in your browser. You'll notice that while
torrents get added, they don't actually have their progress updated. Since
there isn't any downloading occurring in your browser, the status event comes
back successfully (and adds a progress bar) but the progress isn't updated
automatically. To get something added to your progress bars, add any torrent on
the page by clicking on it and then type this into your debugging console
(Firebug for example):

    bt.torrent.all()[bt.torrent.keys[0]].properties.set('progress', 500)

If everything is working correctly, you should see the progress bar of that
torrent jump to half completed almost at once.

And, now let's package the app up. Make sure you're in the `media_downloader`
directory and:

    % zip -r ../media_downloader.btapp .

Open up your client and double click on `media_downloader.btapp`. The app
should be added into your client. Take some time adding torrents to get a feel
of the user interactions that are going on here.

After playing around with this app, you'll notice a couple rough spots. First,
every time you go to the app, it takes a couple minutes to load the list. The
user experience is bad as your users will end up twiddling their thumbs while
they wait. Second, after clicking on a torrent, it takes a little while to
actually add the torrent. During that time, there's no notification to the user
that something has occurred and is working in the background.

To fix the first problem, let's make the app use something called the stash. At
the bottom of `js/list.js`, add some new code right after `$.getJSON` inside
the `$(document).ready()` function:

    var items = bt.stash.get('items', []);
    for (var i=0; i < items.length; i++) {
        render_item(items[i]);
    }

Right when the app comes up, there's a list of torrents to add. Unfortunately,
the list is getting duplicated by the `$.getJSON` call completing. Let's modify
`render_item` a little bit to make sure that doesn't happen anymore. Replace
`render_item` with the following:

    function render_item(item) {
        item.torrents[0].url = item.torrents[0].url.replace(/ /g, '');
        if ($("li a[href=" + item.torrents[0].url + "]").length > 0)
            return
        var elem = $('<li><a href="'+item.torrents[0].url+'">'+
                     item.title + '</a></li>');
        $("#items").append(elem);
        elem.click(function() {
            bt.add.torrent(item.torrents[0].url, function(resp) {
                if (resp.message == 'success') {
                    elem.append("<div class='bar'></div>");
                    $(".bar", elem).progressbar();
                }
            });
            return false;
        });
    }

Any elements that aren't in the stash will get appended to the end of the
list. There are also some edge cases in this exact implementation. When using
this for your own app, make sure you think about what constitutes a new/old
item.

Making sure users are up to date with what's going it their client is
important. Towards this end, let's add a little bit of notification chrome to
the application to show when a user tries to add a torrent and whether it fails
or not. First, edit `html/index.html` to have a place where we can notify users
of what's going on. To the top of that file, add:

    <div id="notification"></div>

We're going to want to have the notification area hidden until there's
something to notify the user about. To add a little styling to this area,
create the file `css/list.css` and add the following to it:

    #notification {
        display: none;
        border: 1px solid;
        margin: 2px;
        padding: 2px;
        text-align: center;
    }

This file will get automatically included in your app, so don't worry about
adding the link to the css anywhere. To get the area actually working, let's
add some javascript. Replace `elem.click` in `render_item` with the following:

    elem.click(function() {
        $("#notification").text(
            'Adding a torrent, please be patient...').slideDown();
        bt.add.torrent(item.torrents[0].url, function(resp) {
            if (resp.message == 'success') {
                elem.append("<div class='bar'></div>");
                $(".bar", elem).progressbar();
            }
        });
        return false;
    });
