#
# Copyright (c) 2010 BitTorrent Inc.
#

import BaseHTTPServer
import logging
import SimpleHTTPServer
import os
import urllib

import griffin.command.base

class GriffinRequests(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def address_string(self):
        # Non-localhost calls get timeouts in getfqdn
        # (why does a "Basic" http server do this?)
        return self.client_address[0]

    def translate_path(self, path):
        # Firefox on windows (for some reason) sends /asdf\asdf instead of
        # /asdf/asdf
        path = urllib.unquote(path).replace('\\', '/')
        return SimpleHTTPServer.SimpleHTTPRequestHandler.translate_path(
            self, path)

    def do_POST(req):
        fp = open(os.path.join('test', req.path[1:]), 'w')
        fp.write(req.rfile.read(int(req.headers['Content-Length'])))
        fp.close()
        req.send_response(200)

class serve(griffin.command.base.Command):

    help = 'Run a development server to debug the project.'
    user_options = [ ('port=', 'p', 'Port to listen on.', None) ]
    option_defaults = { 'port': '8080' }
    pre_commands = [ 'generate' ]

    def run(self):
        logging.info('\tstarting server, access it at http://localhost:%s' % (
                self.options['port'],))
        httpd = BaseHTTPServer.HTTPServer(
            ('', int(self.options['port'])), GriffinRequests)
        httpd.serve_forever()
