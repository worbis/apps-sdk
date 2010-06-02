#!/usr/bin/env python
#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Run the actual Griffin program (and parse out input).
"""

import ConfigParser
import copy
import distutils.fancy_getopt
import logging
import os
import sys

import griffin.command
import griffin.config

class Options(dict):

    def __getattr__(self, k):
        return self.get(k, None)

    def __setattr__(self, k, v):
        self[k] = v

class Vanguard(object):

    global_options = [ ('verbose', 'v', 'run verbosely (default)', None),
                       ('quiet', 'q', 'run quiety (turns verbose off)', None),
                       ('help', 'h', 'show detailed help message', None),
                       ('debug', 'd', 'run with debugging options enabled',
                        None)
                       ]
    display_options = [
        ('help-commands', None, 'list all available commands', None),
                        ]
    negative_opt = { 'quiet': 'verbose' }

    def __init__(self):
        self.command_options = {}
        self.options = Options()
        self.args = sys.argv[1:]
        self.ran = []

    def _command_opts(self, command):
        d = self.command_options.get(command)
        if not d:
            d = self.command_options[command] = {}
        return d

    def parse_config_files(self):
        """Parse the default config files.

        The order of resolution is:
        - project/.griffin.cfg
        - $HOME/.griffin.cfg
        """
        config_handler = griffin.config.Config()
        self.command_options = config_handler

        for k, v in self._command_opts('general').iteritems():
            self.options[k] = v

    def is_display_option(self, order, parser):
        if self.options.help_commands:
            self.print_commands()
            return True
        return False

    def parse_command_line(self):
        """Parse the command line.

        Note that any options on the command line will override config file
        options.
        """
        self.commands = []
        parser = distutils.fancy_getopt.FancyGetopt(
            self.global_options + self.display_options)
        parser.set_negative_aliases(self.negative_opt)
        # XXX - Need to fail gracefully if parsing fails here
        args = parser.getopt(args=self.args, object=self.options)
        order = parser.get_option_order()
        self.setup_logging()

        if self.is_display_option(order, parser):
            return

        while args:
            args = self._parse_command_opts(parser, args)
            if not args:
                return

        if self.options.help:
            self._show_help()
            return
        return True

    def get_command(self, name):
        module_name = 'griffin.command.%s' % (name,)
        try:
            __import__(module_name)
            module = sys.modules[module_name]
            return getattr(module, name)
        except ImportError, UnboundLocalError:
            logging.error('The command %s does not exist.' % (name,))
            self.print_commands()
            sys.exit(1)

    def _parse_command_opts(self, parser, args):
        command_name = args[0]
        try:
            command = self.get_command(command_name)
        except AttributeError:
            logging.error('%s is not a valid command.')
            self.print_commands()
            return
        self.commands.append(command)

        negative_opt = self.negative_opt
        if hasattr(command, 'negative_opt'):
            negative_opt = copy.copy(negative_opt)
            negative_opt.update(command.negative_opt)

        parser.set_option_table(self.global_options +
                                command.user_options)
        parser.set_negative_aliases(negative_opt)
        (args, opts) = parser.getopt(args[1:])
        if hasattr(opts, 'help') and opts.help:
            self._command_opts(command_name)['help'] = 1
            self._show_help()
            return

        opt_dict = self._command_opts(command_name)
        for k, v in vars(opts).items():
            opt_dict[k] = v

        return args

    def print_commands(self):
        logging.error('Commands:')
        for command in griffin.command.__all__:
            logging.error('%5s%-15s%-60s' % (
                    '', command, self.get_command(command).help))

    def run_commands(self):
        for command in self.commands:
            self.run_command(command.__name__)
            logging.error('')

    def run_command(self, command_name):
        if command_name in self.ran:
            return
        command = self.get_command(command_name)
        for pre in command.pre_commands:
            self.run_command(pre)
        logging.info('running `%s` ...' % (command_name,))
        command(self).run()
        self.ran.append(command_name)
        for post in command.post_commands:
            self.run_command(post)

    def setup_logging(self):
        handlers = logging.getLogger().handlers
        if len(handlers) == 1:
            handlers.pop()
        logging.basicConfig(format='%(message)s')
        logger = logging.getLogger()
        if self.options.debug:
            logger.setLevel(logging.DEBUG)
        elif self.options.verbose == 0:
            logger.setLevel(logging.WARNING)
        else:
            logger.setLevel(logging.INFO)

    def _show_help(self):
        logging.error('Global options:')
        self._print_help(self.global_options + self.display_options)
        for command in self.commands:
            if len(command.user_options) == 0:
                continue
            logging.error('Options for \'%s\' command:' % (
                    command.__name__,))
            self._print_help(command.user_options)
        logging.error('')
        logging.error('usage: griffin [global_opts] cmd1 ' \
                          '[cmd1_opts] [cmd2 [cmd2_opts] ... ]')
        logging.error('   or: griffin --help [cmd1 cmd2 ...]')

    def _print_help(self, options):
        for opt in options:
            logging.error('  %-18s%-60s' % (
                    '--%s %s' % (opt[0], '(-%s)' % (opt[1],) if opt[1] else ''),
                    opt[2]))
        logging.error('')

def run():
    handler = Vanguard()
    handler.parse_config_files()
    handler.parse_command_line()
    if not handler.options.help and \
            len(filter(lambda x: 'help' in x,
                       [x.keys() for x in
                        handler.command_options.values()])) == 0:

        handler.run_commands()

if __name__ == '__main__':
    run()
