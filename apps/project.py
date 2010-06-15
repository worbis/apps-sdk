#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
An apps sdk project.
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
                'site': 'http://apps.bittorrent.com',
                'author': 'Default Author <default@example.com>',
                'keywords': [ 'example' ],
                'bt:publisher': 'Example Publisher',
                'bt:update_url': "http://localhost/example",
                'bt:release_date': '00/00/0000',
                'bt:description': 'This is the example app.',
                'bt:libs': [
                    { 'name': 'apps-sdk',
                      'url': 'http://staging.apps.bittorrent.com/pkgs/apps-sdk.pkg' }
                    ]
                }


