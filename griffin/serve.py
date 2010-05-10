#!/usr/bin/env python
#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Serve an application locally for development.
"""

import BaseHTTPServer
from mako.template import Template
import optparse
import os
import pkg_resources
import SimpleHTTPServer

def styles():
    return [os.path.join('css', x) for x in
            filter(lambda x: os.path.splitext(x)[1] == '.css',
                   os.listdir('css'))]

def generate_index():
    template = Template(filename=pkg_resources.resource_filename(
            'griffin.data', 'index.html'))
    index = open('index.html', 'w')
    index.write(template.render(scripts=[], styles=styles()))
    index.close()

def listen(port):
    httpd = BaseHTTPServer.HTTPServer(
        ('', options.port), SimpleHTTPServer.SimpleHTTPRequestHandler)
    httpd.serve_forever()

if __name__ == '__main__':
    usage = "usage: %prog [options] name"
    parser = optparse.OptionParser(usage=usage)
    parser.add_option('-p', '--port', dest='port', default=8080,
                      type=int, help='Port for the server to listen on.')
    (options, args) = parser.parse_args()

    if len(args) < 1:
        args.append('.')

    os.chdir(args[0])
    generate_index()
    listen(options.port)
