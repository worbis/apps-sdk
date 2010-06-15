#
# Copyright (c) 2010 BitTorrent Inc.
#

import BaseHTTPServer
import logging
import SimpleHTTPServer
import os
import urllib

import apps.command.base

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

    def send_head(self):
        # Special version of send_head that falls back to the build directory.
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            if not self.path.endswith('/'):
                # redirect browser - doing basically what apache does
                self.send_response(301)
                self.send_header("Location", self.path + "/")
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                # XXX - Modification
                if self.path == '/':
                    path = os.path.join(path, 'build')
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return self.list_directory(path)
        ctype = self.guess_type(path)
        try:
            # Always read in binary mode. Opening files in text mode may cause
            # newline translations, making the actual size of the content
            # transmitted *less* than the content-length!
            f = open(path, 'rb')
        except IOError:
            # XXX - Modification, don't send the error here.
            return None
        self.send_response(200)
        self.send_header("Content-type", ctype)
        fs = os.fstat(f.fileno())
        self.send_header("Content-Length", str(fs[6]))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        self.end_headers()
        return f

    def do_GET(self):
        f = self.send_head()
        if not f:
            self.path = '/build' + self.path
            f = self.send_head()
        if not f:
            self.send_error(404, 'File not found')
        if f:
            self.copyfile(f, self.wfile)
            f.close()

    def do_POST(self):
        fp = open(os.path.join('test', self.path[1:]), 'wb')
        fp.write(self.rfile.read(int(self.headers['Content-Length'])))
        fp.close()
        self.send_response(200)

class serve(apps.command.base.Command):

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
