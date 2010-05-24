#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Bundle a project into a btapp file, use .ignore for excludes.
"""

import optparse
import sys

import griffin.setup

if __name__ == '__main__':
    usage = "usage: %prog [options]"
    parser = optparse.OptionParser(usage=usage)
    parser.add_option('-d', '--debug', dest='debug', default=False,
                      action='store_true',
                      help='Include firebug for debugging.')
    parser.add_option('-p', '--path', dest='path', default='.',
                      help='Path to save the .btapp file to.')

    (options, args) = parser.parse_args()

    griffin.setup.Project('.', debug=options.debug).btapp(path=options.path)
