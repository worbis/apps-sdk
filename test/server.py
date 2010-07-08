#
# Copyright (c) 2010 BitTorrent Inc.
#

import BaseHTTPServer
import logging
import SimpleHTTPServer
import os
import urllib

class CookieServe(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def send_head(self):
        """Common code for GET and HEAD commands.

        This sends the response code and MIME headers.

        Return value is either a file object (which has to be copied
        to the outputfile by the caller unless the command was HEAD,
        and must be closed by the caller under all circumstances), or
        None, in which case the caller has nothing further to do.

        """
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
            self.send_error(404, "File not found")
            return None
        self.send_response(200)
        self.send_header("Content-type", ctype)
        fs = os.fstat(f.fileno())
        self.send_header("Content-Length", str(fs[6]))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        self.send_header('Set-Cookie', 'PREF=ID=033a176829741298:TM=1278617542:LM=1278617542:S=jJ-ZDVfUJD-jjLNB; expires=Sat, 07-Jul-2012 19:32:22 GMT; path=/; domain=.localhost')
        self.send_header('Set-Cookie', 'accepting=1; Domain=.localhost; Expires=Fri, 08-Jul-2011 20:28:58 GMT; Path=/bar')
        self.end_headers()
        return f

    def do_GET(self):
        """Serve a GET request."""

        print self.headers.get('Cookie', '')
        f = self.send_head()
        if f:
            if 'Cookie' in self.headers:
                f.write(self.headers['Cookie'])
            else:
                f.write('none')
            f.close()

if __name__ == '__main__':
    httpd = BaseHTTPServer.HTTPServer(('', 8080), CookieServe)
    httpd.serve_forever()
