#!/usr/bin/env python
#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Serve an application locally for development.
"""

import BaseHTTPServer
import optparse
import os
import pkg_resources
import SimpleHTTPServer

import griffin.setup

def listen(port):
    httpd = BaseHTTPServer.HTTPServer(
        ('', options.port), SimpleHTTPServer.SimpleHTTPRequestHandler)
    httpd.serve_forever()

if __name__ == '__main__':
    usage = "usage: %prog [options] name"
    parser = optparse.OptionParser(usage=usage)
    parser.add_option('-p', '--port', dest='port', default=8080,
                      type=int, help='Port for the server to listen on.')
    parser.add_option('-d', '--debug', dest='debug', default=False,
                      action='store_true',
                      help='Include firebug for debugging.')
    (options, args) = parser.parse_args()

    if len(args) < 1:
        args.append('.')

    os.chdir(args[0])
    griffin.setup.Project('.', debug=options.debug).index()
    listen(options.port)
