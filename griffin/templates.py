#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Templates for auto-generation of common griffin files.
"""

__author__ = 'Thomas Rampelberg'
__date__ = "%date%"
__version__ = "%version%"

from mako.template import Template

def render_template(name, **kwargs):
    return Template(name).render(**kwargs)

index_html = """
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
	"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    % if debug == True:
    <script src="lib/firebug.js"></script>
    <script type="text/javascript">
        firebug.env.height = 250;
    </script>
    % endif
    % for script in dependencies:
    <script type="text/javascript" src="$(script)"></script>
    % endfor
</head>
<body>
</body>
</html>
"""
