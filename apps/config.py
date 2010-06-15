#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Griffin configuration handler
"""

import ConfigParser
import os

class Config(dict):

    config_filename = '.apps.cfg'

    def __init__(self):
        self.path = { 'local': self.config_filename,
                      'global': os.path.join(os.path.expanduser('~'),
                                             self.config_filename)
                      }
        self.files = {}
        self.find_config_files()
        self.parse_config()

    def _open_config(self, fname):
        config = ConfigParser.SafeConfigParser()
        config.read(fname)
        return config

    def parse_config(self):
        for f in self.files.values():
            config = self._open_config(f)
            for section in config.sections():
                if not section in self:
                    self[section] = {}
                for opt in config.options(section):
                    self[section][opt] = config.get(section, opt)

    def find_config_files(self):
        if os.path.isfile(self.path['global']):
            self.files['global'] = self.path['global']

        if os.path.isfile(self.path['local']):
            self.files['local'] = self.path['local']

    def set(self, section, opt, val, typ='local'):
        if not typ in self.files:
            self.create(self.path[typ])
        conf = self._open_config(self.path[typ])
        if not section in conf.sections():
            conf.add_section(section)
        conf.set(section, opt, val)
        f = open(self.path[typ], 'wb')
        conf.write(f)
        f.close()
        self.parse_config()

    def create(self, path):
        f = open(path, 'wb')
        f.write('')
        f.close()
