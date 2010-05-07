#!/usr/bin/env python
#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Develop, build and package griffin apps.
"""

import optparse
import os
import sys

import griffin.targets

if __name__ == '__main__':
    usage = "usage: %prog [options] target"
    parser = optparse.OptionParser(usage=usage)
    parser.add_option('-d', '--debug', action='store_true', dest='debug',
                      default=False,
                      help='Enabling debug mode for an application ' \
                          'includes the firebug console in application ' \
                          'builds as well as some other development ' \
                          'friendly options.')
    parser.add_option('-p', '--path', default='.',
                      help='The path to your application. This defaults to ' \
                          'the local directory.')
    (options, args) = parser.parse_args()

    if not args[0] in griffin.targets.available_targets:
        print 'Must use an available target, the targets are: %s' % (
            '|'.join(griffin.targets.available_targets),)
        sys.exit(1)

    search_path = os.getenv('GRIFFINPATH', '').split(':')

    target = getattr(griffin.targets, args[0])(options.path, search_path,
                                               options.debug)
    target.run()

