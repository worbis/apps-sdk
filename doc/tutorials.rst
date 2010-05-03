------------
Hello World
------------

Welcome to Griffin! Griffin provides a powerful, rich javascript framework that
allows you to build applications for the BitTorrent client. This tutorial will
take you through the basics of creating a new application and some basic
interactions with the BitTorrent client itself. This is a work in progress, so
please send feedback or ask questions as you work through the tutorial.

If, at any time you'd like to see a complete version of the app that this
tutorial builds, take a look at `Hello World
<http://github.com/bittorrent/griffin/tree/master/examples/hello_world>`_.

Setup
=====

First, let's get the application directory setup correctly. First, open your
terminal and run the following commands:

::

  $ mkdir hello_world
  $ cd hello_world

Now that we've got the application directory created, let's create another
directory. This will end up being used later on.

::

  $ mkdir lib

Every application only has one page that gets rendered: index.html. This page
will have to contain all the static HTML that you would like to be
viewed. Obviously, there will be reasons to change the original view and we'll
be able to do that through javascript.

::

  $ touch index.html

As part of your application, there will be an icon that shows up next to the
app's name in the sidebar of your BitTorrent client. The image that is used for
this is named "icon.bmp" and is packaged as part of your application.

::


  $ cp ../griffin/examples/hello_world/icon.bmp hello_world

Finally, there is metadata associated with each application. The name of your
application and the auto-update url are some of this metadata. The file that
contains this data is called "btapp" without a file extension. Let's open that
file up in your favorite editor.

::

  $ nano btapp

Into the btapp file, we'll put two lines:

::

  name:Hello World!
  update_url:http://localhost/hello


The "name" line contains the name that shows up in the BitTorrent client
sidebar. "update_url" is the place that your application can be downloaded
from. It is checked every 24 hours and if the modification time is earlier than
the current install of your application, the new version will be downloaded and
installed transparently to the user.

Hello!
======

Okay! It is time to actually get something up. Open index.html and enter the
following text:

::
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
  	"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

  <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
    <head>
    </head>
    <body>
      <h1>Hello World!</h1>
    </body>
  </html>
  
Feel free to open this up in your browser of choice. Since Griffin applications
are just html, css and javascript. It makes sense to do a lot of the
development inside your favorite browser with all the debug tools that come
with it. In fact, much of the btapp API has been implemented purely in
javascript so that you can do as much development as you'd like in your browser
before packaging and installing the app in your BitTorrent client.

Packaging
=========

Now, applications are just zip files with .btapp extensions. This makes it easy
to package your application up for install into your BitTorrent client. One way
to get this all packaged is:

::

  $ zip -r ../hello.btapp .

This command will recursively zip up everything in the local directory and
package it into a hello.btapp file. 

Installation
============

There are a couple different ways to install applications into your BitTorrent
client. One way is to double click on the .btapp file. You should be prompted
to install into the BitTorrent client. Another way is to drag the file onto the
client. Let's use that method now.

Take hello.btapp and drag it onto your client. You should be prompted as to
whether the app should be installed or not. You've now got your first
application installed! 

Use
===

Under the apps icon, there should now be "Hello World!". Clicking on that will
bring up your application. Unfortunately, there isn't much to do yet. Let's
work on that.

