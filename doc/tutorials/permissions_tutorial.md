---
title: Permissions
layout: default
---

# Setting App Permissions

Apps currently have three permissions levels, set by the bt:access property.

- default

  The app can only view and change properties of torrents which have been added
  through the app itself

- list_restricted

  The app can view the properties of all of the user's torrents regardless of
  origin

- restricted

  The app can view and change properties of all torrents regardless
  of origin

If the bt:access property is set to a restricted value, the user will be
informed that the app is requesting the given permissions when they install
the app.

# Working With Elevated App Permissions

Create a new app with:

    % apps setup --name=yourname

Add the JUP dependency with:

    % apps add --file=http://staging.apps.bittorrent.com/pkgs/jup.js

Open package.json and add a line before the closing brace:

    "bt:access":"list_restricted"

To confirm that you have read access to all torrents, add the following to
`$(document).ready()` in `lib/index.js`:

    $.each(bt.torrent.keys(), function(i, item){
        console.log(i+", "+item+", "+bt.torrent.get(item).properties.get("name"));
    });

Compile the app with:

    % apps --debug package

Run the app in the client. You should see a notification that the app is
requesting read access to all torrents when you install. Upon opening the app,
you should see a list of all your current torrents in the debug window.

Now that we have read access to all torrents, let's make a simple selector
which will dynamically display information about each torrent. Replace your
`html/index.html` file with the following:

    <select id="torrentSelector"></select>
    <ul id="torrentinfo"></ul>

Add the following JUP template variables to your `lib/index.js`:

    var li_template = [ "li", "{{label}}", "{{property}}" ];
    var opt_template = [ "option", { "value": "{{hash}}" }, "{{name}}" ];

Add a list of torrent properties and appropriate labels in the follwing way:

    var properties = { "remaining":"Remaining: ",
                       "size":"Size: ",
                       "progress":"Progress: ",
                       "download_speed":"Download speed: ",
                       "eta":"ETA: ",
                       "peers_connected":"Peers: ",
                       "peers_in_swarm":"Total peers: ",
                       "seeds_connected":"Seeds: ",
                       "seeds_in_swarm":"Total seeds: "};

For a full list of torrent properties, refer to the [API documentation](../api.index).

Replace the line in `$(document).ready()` which calls console.log with this:

    $("#torrentSelector").append($(JUP.html(
        { hash: item,
          name: bt.torrent.get(item).properties.get("name")
        }, opt_template)));

Now that the select box will be populated with the names of all the torrents,
add the following to `$(document).ready()`:

    $("#torrentSelector").change(function() {
        var torrent = bt.torrent.get($("#torrentSelector").val());
        $("#torrentinfo").html("");
        $.each(properties, function(prop, lbl) {
            $("#torrentinfo").append($(JUP.html(
                { property: torrent.properties.get(prop),
                  label: lbl
                }, li_template)));
        });
     });

When the selection in the select box changes, this code clears the torrent
info list and prints all of the propeties for the selected torrent.

Compile and run your app, and you should see all of the torrent names in the
drop-down list. Their associated properties should display when you click
on the options.
