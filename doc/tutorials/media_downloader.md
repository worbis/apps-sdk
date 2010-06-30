---
layout: default
title: Media Downloader
---

This is a tutorial that will introduce consumption of remote resources from
within an application as well as how to make the application feel a little more
like a native application than a web page. The focus is on media and
specialized feeds that are not RSS.

A complete version of the app from this tutorial can be found at: [Media Downloader Example](http://github.com/bittorrent/apps-sdk/tree/master/examples/media_downloader).

First, let's get some tools installed. For Windows, there is a convenient
installer. Download and run[the tools
installer](/apps-sdk/client/apps-sdk-installer.msi). For other operating
systems, follow the instructions in the [install howto](../install-howto.html).

Once the tools have been installed and setup, create your project directory:

    % apps setup --name media_downloader
    % cd media_downloader

Inside the new `media_downloader` directory, there will be the basic structure
of an application. Two of the files in this directory are particularly
important:

- package.json

  This is a file that describes your app. Take a look and edit
  the values to something that makes a little more sense. Pay attention to
  `bt:update_url`. This is the location that will be checked for updates once
  your client has been installed. Make sure that this is a valid location so
  that you can update your app.

- icon.bmp

  The icon used to display your app inside the client. It is an icon
  that is 16x16 pixels and must be a BMP file.

Several of the directories are important too:

- package

  Local copies of all your external dependencies reside here.

- build

  Auto-generated files that are required.

- dist

  This is where built versions of your client end up.

- html

  Put the html that comes with your app here.

- lib

  The javascript that actually runs your app should go here.

Take a look at `package.json` now. Pay special attention to a`bt:libs`. It
should look like:

    "bt:libs": [
        {
            "url": "http://staging.apps.bittorrent.com/pkgs/apps-sdk.pkg",
            "name": "apps-sdk"
        }
    ]

`bt:libs` specifies the third party dependencies for your application. To
update these to the latest versions at any time, run:

    % apps update

Now, let's add a couple new external dependencies:

    % apps add --file=http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/jquery-ui.js
    % apps add --file=http://staging.apps.bittorrent.com/pkgs/jup.js

Take a look at `package.json` again. `bt:libs` will look a little different:

    "bt:libs": [
        {
            "url": "http://staging.apps.bittorrent.com/pkgs/apps-sdk.pkg",
            "name": "apps-sdk"
        },
        {
            "url": "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/jquery-ui.js",
            "name": "jquery-ui"
        },
        {
            "url": "http://staging.apps.bittorrent.com/pkgs/jup.js",
            "name": "jup"
        }
    ]

As you can see, there are 2 new dependencies that have been added to your
project under the `packages` directory and can be updated via.
`apps update`. To help with packaging and remote linking, when you run
`apps add`, the file is downloaded in saved in `packages/`.

Since this is all about downloading media, let's get the main page to
present list of content. Open `html/main.html` in the `media_downloader`
directory and replace what's there with:

    <ul id="items"></ul>

You'll notice that there isn't any `<script/>`, `<html/>` or `<body/>` tags in
this file. These are all auto-generated for you based on the dependencies,
javascript and css in your project. If you'd like to see what gets generated,
take a look at `build/index.html`.

The `lib` directory is where all your javascript should go. `index.js` inside
this directory is a little special. It will always be the last script loaded
and should be where all the main loading logic for your program should go. Now,
open `lib/index.js` so that we can add some javascript to populate that list.

    function render_item(item) {
        var template = [ "li", [ "a", { "href": "{{url}}" }, "{{title}}" ],
                         ["div", { "class": "bar" } ] ];
        var elem = $(JUP.html({ url: item.torrents[0].url, title: item.title },
                              template));
        $("#items").append(elem);
    }

    $(document).ready(function() {
        $("head").append('<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/base/jquery-ui.css" type="text/css" media="all">');
        $.getJSON('http://vodo.net/jsonp/releases/all?callback=?',
            function(items) {
                for (var i = 0, ii = items.length; i < ii; i++)
                    render_item(items[i]);
            });
    });

Most of this code is pretty standard jquery and javascript. However, there's
also the `JUP` library. JUP is a javascript templating library. A lot of apps
end up rendering quite a bit of content dynamically. Without some kind of
templating, your code ends up being this unmaintainable soup of `+` between
strings all over the place. While there are many templating libraries for
javascript, we're suggesting JUP at this point because of its lightweight
nature and ease of use. You can use whatever javascript or templating tools
you'd like; we just suggest that using some kind of templating library will
make your life easier.

Run your application in local mode via. `apps serve` and open in a [local
browser](http://localhost:8080) (http://localhost:8080). You will see a list
of links with the torrent title.

To make it so any of these torrents can be added to your client, let's add a
line to `render_item` in `lib/index.js`:

    $("a", elem).click(function() {
        bt.add.torrent(item.torrents[0].url);
        return false;
    });

Using `apps serve` again will let you see how this looks in your browser. Now,
let's test the app in your client. Run:

    % apps --debug package

Double click on the newly created file: `dist/media_downloader.btapp`. This
will open with your &micro;Torrent client, and appear in the left sidebar under
"Apps". Take a look at the application and try to add some torrents.

Looking at the app so far in your client, you'll notice that there's a debug
console on the bottom of the window. The `--debug` option can be used for any
`apps` command and usually enables some extra debugging information. When
packaging your project, this includes a debug console. It works like a normal
debug console letting you log to it via. `console.log()` and navigate the
current DOM from the `HTML` tab.

Now, let's make the app reflect that an added torrent actually started
downloading. Replace the render item function in `lib/index.js` with:

    function render_item(item) {
        var template = [ "li", [ "a", { "href": "{{url}}" }, "{{title}}" ],
                         ["div", { "class": "bar" } ] ];
        var elem = $(JUP.html({ url: item.torrents[0].url, title: item.title },
                              template));
        $("#items").append(elem);
        $("a", elem).click(function() {
            bt.add.torrent(item.torrents[0].url, function(resp) {
                if (resp.message == 'success') {
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
there will need to be a little more code. Just add this at the bottom of
`lib/index.js`.

    function update_progress() {
        var torrents = bt.torrent.all();
        for (var i in torrents) {
            var container = $(
                sprintf("li a[href=%s]",
                        torrents[i].properties.get('download_url'))
            ).closest('li');
            $(".bar", container).progressbar(
                { value: torrents[i].properties.get('progress') / 10 });
        }
    }

A quick note about sprintf: This function is part of the app-sdk's
dependencies and provides full C/C++ sprintf functionality. Once you've added
`update_progress` to `lib/index.js`, add the following inside the
`$(document).ready()` function:

    setInterval(update_progress, 100);

Take a little time to play with this in your browser. You'll notice that while
torrents get added, they don't actually have their progress updated. Since
there isn't any downloading occurring in your browser, the status event comes
back successfully (and adds a progress bar) but the progress isn't updated
automatically. To get something added to your progress bars, add any torrent on
the page by clicking on it and then type this into your debugging console
(Firebug for example):

    >>> bt.torrent.all()[bt.torrent.keys()[0]].properties.set('progress', 500)

If everything is working correctly, you will see the progress bar of that
torrent jump to half completion almost at once.

And, now let's package the app up. Make sure you're in the `media_downloader`
directory and once again:

    % apps package

Open up your client and double click on `media_downloader.btapp`. The app
will be added into your client. Take some time adding torrents to get a feel
of the user interactions that are going on here.

After playing around with this app, you'll notice a couple rough spots. First,
every time you go to the app, it takes a long time to load the list. The
user experience is poor: your users will end up twiddling their thumbs while
they wait. Second, after clicking on a torrent, it takes a little while to
actually add the torrent. During that time, there's no notification to the user
that something has occurred and working in the background.

To fix the first problem, let's make the app use something called the stash, a
local data store. At the bottom of `lib/index.js`, add some new code right
after `$.getJSON` inside the `$(document).ready()` function:

    var items = bt.stash.get('items', []);
    for (var i=0; i < items.length; i++) {
        render_item(items[i]);
    }

You then also need to add this line at the beginning of the `getJSON` handler

    bt.stash.set('items', items);

Right when the app comes up, there's a list of torrents to add. Unfortunately,
the list is getting duplicated by the `$.getJSON` call completing. Let's modify
`render_item` a little bit to make sure that doesn't happen anymore. Replace
`render_item` with the following:

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
            bt.add.torrent(item.torrents[0].url, function(resp) {
                if (resp.message == 'success') {
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
add some javascript. Replace `$("a", elem).click` in `render_item` with the
following:

    $("a", elem).click(function() {
        $("#notification").text(
            'Adding a torrent, please be patient...').slideDown();
        bt.add.torrent(item.torrents[0].url, function(resp) {
            if (resp.message == 'success') {
                $("#notification").slideUp();
                $(".bar", elem).progressbar();
            } else {
                $("#notification").text(
                    'There was a problem adding the torrent :(');
            }
        });
        return false;
    });

Once a download is completed, it's convenient to give the user of your
application a button to play or open the file. First, let's get rid of the
progress bars on torrents that have completed and replace them with play
buttons. Replace `update_progress` in `lib/index.js` with the following:

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
            $("<button class='play'>Play</button>").appendTo(container).click(
                function() {
                    var files = tor.file.all();
                    var f;
                    for (var i in files) {
                        if (!f || f.properties.get('size') >
                            files[i].properties.get('size'))
                                f = files[i];
                    }
                    f.open();
                });
        }
    }

We're expecting here that the biggest file in a torrent is the file that you
want to play. The experience that you get from within the browser ends up being
a little lackluster. However, give this a try in your client. You can play
content from right there, instead of having to hunt around on the file system
for it.
