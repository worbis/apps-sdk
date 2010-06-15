#
# Copyright (c) 2010 BitTorrent Inc.
#

import ConfigParser
import logging
import sys

import griffin.config
import griffin.command.base

class config(griffin.command.base.Command):

    help = 'View and modify configuration of your project and griffin.'
    user_options = [
        ('global', 'g',
         'set the options globally ($HOME/.griffin.cfg)', None),
        ('key=', None, 'the config name to update', None),
        ('value=', None, 'the value to update the config to', None),
        ('command=', None, 'the command to push the change to.', None)
        ]
    option_defaults = { 'command': 'general' }

    def print_value(self, section, opt):
        logging.error('%20s=%-60s' % (
                '%s.%s' % (section, opt),
                self.config.get(section, {}).get(opt, 'unset')))

    def run(self):
        self.config = griffin.config.Config()
        if not self.options.get('key', None):
            logging.error('Must include `--key` for the key you\'d like to ' \
                              'set or get')
            return
        if self.options.get('value', None):
            self.config.set(
                self.options['command'], self.options['key'],
                self.options['value'],
                'global' if self.options.get('global', None) else 'local')
        self.print_value(self.options['command'], self.options['key'])
