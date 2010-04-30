#!/usr/bin/env python
#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Develop, build and package griffin apps.
"""

import optparse

import griffin.targets

if __name__ == '__main__':
    usage = "usage: %prog [options] [%s]" % ''.join(griffin.targets.available_targets)
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
    parser.add_option('-s', '--sdk', default='package',
                      help='The path to the location that the griffin ' \
                          'toolkit was installed. This defaults to package/.')

