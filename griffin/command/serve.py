#
# Copyright (c) 2010 BitTorrent Inc.
#

import BaseHTTPServer
import logging
import SimpleHTTPServer

import griffin.command.base

class serve(griffin.command.base.Command):

    help = 'Run a development server to debug the project.'
    user_options = [ ('port=', 'p', 'Port to listen on.', None) ]
    option_defaults = { 'port': '8080' }
    pre_commands = [ 'generate' ]

    def run(self):
        logging.info('\tstarting server, access it at http://localhost:%s' % (
                self.options['port'],))
        httpd = BaseHTTPServer.HTTPServer(
            ('', int(self.options['port'])),
            SimpleHTTPServer.SimpleHTTPRequestHandler)
        httpd.serve_forever()
