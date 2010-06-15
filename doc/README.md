
# Griffin Software Development Kit

[TOC]

## Introduction

Griffin makes it possible to create a native application that runs inside the
BitTorrent client. This allows developers to create their own interface which
not only gathers and displays information from arbitrary internet resources but
also data specific to a user's BitTorrent client. This document will describe
how to develop these applications, integrate with a user's BitTorrent client as
well as how to build and deploy the completed applications.

Griffin utilizes standard web technologies such as Javascript and HTML. By
delivering a standard framework to write applications in, anyone can develop a
rich javascript application that looks and feels just like a standard desktop
application.

For more information, see http://griffin.bittorrent.com.

## System Requirements

To run an application, all you need is the BitTorrent client itself. For
testing of your application, you can either use the BitTorrent client or your
favorite web browser. The Mimic project implements all the BitTorrent client
API within pure javascript so that development of your application can occur in
any regular browser window.

To build Griffin itself, you'll need the following tools:

Also, if you'd like to stay up to date with the latest developments as well as
contribute your work back to the Griffin community, you'll want to install Git:

    http://git-scm.com/.

The entire Griffin project can be found at:

    http://github.com/bittorrent/apps-sdk/

## Getting Started

These instructions are for building a development copy of Griffin. If you'd
just like to get started using Griffin for your web apps, you should instead
download a pre-packaged and compiled copy from:

    http://apps-sdk.bittorrent.com/download/

To build Griffin from source, type "make" from within the root of the Griffin
directory. This will build a release copy of the kit. Typing "make debug" will
build a debug version and "make install" will build and install Griffin and its
associated tools for general use.

## Getting Help

If you need help with Griffin, you can get help from the following sources:

  - FAQ:            http://apps-sdk.bittorrent.com/faq
  - Documentation:  http://apps-sdk.bittorrent.com/doc
  - Wiki:           http://apps-sdk.bittorrent.com/wikis
  - Forums:         http://apps-sdk.bittorrent.com/forums
  - IRC:            irc://irc.freenode.net#apps-sdk
  - Feedback:       apps-sdk@bittorrent.com

If you discover any bugs, please file a ticket at:

  http://apps-sdk.bittorrent.com/issues

## More Information

  - Tutorials:          http://apps-sdk.bittorrent.com/doc/tutorials
  - Programming Guide:  http://apps-sdk.bittorrent.com/doc/programming_guide
  - API:                http://apps-sdk.bittorrent.com/doc/api
  - Design:             http://apps-sdk.bittorrent.com/doc/design

## License

