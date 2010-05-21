Welcome to Griffin! Griffin provides a powerful, rich javascript framework that
allows you to build applications for the BitTorrent client. This tutorial will
take you through the basics of creating a new application and some basic
interactions with the BitTorrent client itself. This is a work in progress, so
please send feedback or ask questions as you work through the tutorial.

If, at any time you'd like to see a complete version of the app that this
tutorial builds, take a look at [Hello World](http://github.com/bittorrent/griffin/tree/master/examples/hello_world/).

# Setup

First, let's get some tools installed. Along with the SDK comes a python
program that makes a bunch of common tasks a little bit easier. To install
these tools, let's go to the directory that you extracted the SDK to.

    % sudo python setup.py install

This will install the Griffin build tools on your system. Now, to get your
project setup. Go to the directory that you'll be creating your application in
and run:

    % python -m griffin.setup hello_world

Now you'll have a hello_world directory. Inside this directory will be the
basic structure of an application. There are three required files:

    btapp
    index.html
    icon.bmp

The `btapp` file defines metadata about your application. If you were to look
inside it, you'd see something like:

    name:hello_world
    version:0.1
    publisher:Default Publisher
    update_url:http://localhost/default
    release_date:00/00/0000
    description:This is the default app.

Most of these are self explanatory. However, `update_url` is a little
special. This url will be checked every 24 hours by every client that installs
your application. If there is a new version of your application at that url (as
decided by a LAST-MODIFIED time), the client will download the new version and
replace the old version with the new.

`icon.bmp` is the icon used to display your application in the client. It is an
icon that is 15x15 pixels.

Okay, now that the basic project structure has been setup, let's see how it all
looks.

    % python -m griffin.serve

Open your favorite browser and go to [your project](http://localhost:8080/) (http://localhost:8080)!
`griffin.serve` is starting up a web server so that you can actively develop
your application in your favorite web browser before trying to see how it works
inside the BitTorrent client.

To view the project inside your client, run:

    % zip -r ../hello_world.btapp .

This will package everything up into the official Griffin package format
(which, just happens to be a zip file). Now, navigate to `hello_world.btapp`
and double click on it. You should now have your application installed and
running.

# Add a torrent

Obviously, the application doesn't do much right now (do people really care
about seeing `Hello World`?). So, to get on with making something a little bit
more useful, let's add the ability to add a torrent. First, we'll need to
modify the HTML to have a control to add the torrent with. Open up
`html/index.html` and have the file look something like:

    <div>Hello World!</div>
    <a id="ubuntu"
       href="http://releases.ubuntu.com/10.04/ubuntu-10.04-desktop-i386.iso.torrent">
       Start downloading a torrent</a>

Don't worry that this doesn't look like your normal `index.html`. The
`index.html` that resides inside the root of your project is a little
special. It is auto-generated based on what is in your project and
`html/index.html` is auto-included by the Griffin SDK for you.

Now, let's hook this HTML up so that the torrent gets easily added to the
client. Create `js/add.js` and put the following code into it:

    $("#ubuntu").click(function() {
        bt.add.torrent("http://releases.ubuntu.com/10.04/ubuntu-10.04-desktop-i386.iso.torrent");
        return false;
    });

And, now to test it out:

    % python -m griffin.serve

Direct your favorite browser to [the normal location](http://localhost:8080/)
and let's see what happens.

To make development easier, the Griffin SDK provides a wrapper around the
client's API. This makes it so that you can get a general feel for how your
application will work while still using your favorite tools (like
Firebug). Click on the torrent link in your browser and see what happens.

Finally, let's update the btapp package and test this out in your client:

    % zip -r ../hello_world.btapp .

Once you've updated your client with the latest code by double clicking on the
file, try adding the torrent and see what happens in your client.

## Failure

Unfortunately, you can't assume that torrent add operations complete every
time. It would be great to check and see whether the add operation succeeded so
that you can message that to the user. Let's add another torrent to the list
that will fail by opening `html/index.html` and adding:

    <a id="fail" href="http://localhost/test.torrent">
      How is a failure handled?
    </a>

Instead of binding an event to only the Ubuntu torrent, let's bind one to all
the add links by changing `js/add.js` a little bit:

    $("a").click(function() {
        bt.add.torrent(this.href, function(resp) {
            $("body").append("Tried to add <" + resp.url +
                ">. The status was: " + resp.status +
                ". That means that it was added " + resp.message);
        });
        return false;
    });

The callback that gets passed in as the second parameter on bt.add.torrent is
an optional callback. Since adding a torrent is an asynchronous operation, a
callback is required to report whether the torrent was actually added to the
client or not.

Give this a try in both your browser and inside the client and check out how it
works.

# Active Torrents

Once a torrent has been added to the client, you're able to check up on that
torrent. Since we've added the Ubuntu torrent to your client already, let's
check up on how it is doing. Start by adding some new HTML to
`html/index.html`.

    <div id="status"></div>

Now, to put the progress in, we'll need to edit `js/add.js`:

    var my_torrent = bt.torrent.get('http://releases.ubuntu.com/10.04/ubuntu-10.04-desktop-i386.iso.torrent');
    $("#status").text(my_torrent.properties.get('progress') / 10);

As you can see, the torrent object itself was fetched via. the URL that it was
downloaded from. This makes sense in this instance since we don't know what the
info hash is beforehand. It is also possible to just fetch the torrent object
using an info hash (`bt.torrent.get('0123456789')`).

In a somewhat different fashion, sometimes it makes sense to update the whole
list of torrents at once instead of a specific one. To do this, let's get the
layout setup in the DOM so that it is easy to add a list of torrents. So, let's
add a little HTML to `html/index.html`.

    <ul id="torrent-list"></ul>

And, add the following to `js/add.js`.

    var torrents = bt.torrent.all();
    for (var i in torrents) {
        var torrent = torrents[i];
        var name = torrent.properties.get('name');
        var progress = torrent.properties.get('progress');
        $("#torrent-list").append('<li>' + name + ': ' + progress + '</li>');
    }

Take a look in your browser and client to get a feeling of what's going on.

# Progress Bars

Sure, a text description of progress is nice, but it sure would be nicer to
have a pretty progress bar wouldn't it? The default libraries make it a little
tough to add in a pretty progress bar but there's a library that makes doing
progress bars really easy (jquery-ui). To add jquery-ui into your project:

    % python -m griffin.add http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/jquery-ui.js

This will fetch jquery-ui from google and add it to your project. If you take a
look at `package.json`, you'll notice that jquery-ui is now part of
`bt:libs`. This means that jquery-ui has been marked as a dependency for your
project and when `index.html` is built, jquery-ui will get included.

Along with the javascript that jquery-ui uses, there is some CSS that is
required. Add the following into `html/index.html`:

    <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/base/jquery-ui.css" type="text/css" media="all">

Since the HTML is already setup to handle this, let's change a little of the
code in `js/add.js`. Find these lines:

    var my_torrent = bt.torrent.get('http://releases.ubuntu.com/10.04/ubuntu-10.04-desktop-i386.iso.torrent');
    $("#status").text(my_torrent.properties.get('progress') / 10);

And remove them. We don't need any stinking text anymore! Instead, replace it
with:

    function update_progress() {
        var my_torrent = bt.torrent.get('http://releases.ubuntu.com/10.04/ubuntu-10.04-desktop-i386.iso.torrent');
        $("#status").progressbar(
            { value: my_torrent.properties.get('progress') / 10 });
    }
    setInterval(update_progress, 100);

Check it out in your browser and client. Hopefully, you're still downloading
the Ubuntu torrent and you can see the progress bar update in real time.

# Remote Resources

