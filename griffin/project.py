#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
A griffin project.
"""

import json
import os

class Project(object):

    def __init__(self, path):
        self.path = path
        self.read_metadata()

    def read_metadata(self):
        try:
            self.metadata = json.load(open(os.path.join(self.path,
                                                        'package.json'), 'r'))
        except IOError, err:
            self.metadata = {
                'name': self.path,
                'version': '0.1',
                'description': 'The default project.',
                'site': 'http://griffin.bittorrent.com',
                'author': 'Default Author <default@default.com>',
                'keywords': [ 'default' ],
                'bt:publisher': 'Default Publisher',
                'bt:update_url': "http://localhost/default",
                'bt:release_date': '00/00/0000',
                'bt:description': 'This is the default app.',
                'bt:libs': [
                    { 'name': 'griffin',
                      'url': 'http://10.20.30.79/apps/lib/griffin.pkg' }
                    ]
                }


