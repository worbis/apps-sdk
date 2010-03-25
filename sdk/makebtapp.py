import os.path
import sys
import base64
from xml.dom.minidom import getDOMImplementation

def b64file(f):
    if not os.path.exists(f):
	print "Must specify an existing file:",f
	sys.exit(1)
    return base64.standard_b64encode(open(f,'rb').read())

def takebmp(f):
    if not os.path.exists(f):
	print "Must specify a bmp file:",f
	sys.exit(1)
    fdata = open(f,'rb').read()
    ico = b64file(f)
    if fdata[0] != 'B' or fdata[1] != 'M':
	print "Must be a BMP file:",f
	sys.exit(1)
    return ico

def takeurl(u):
    if u.find('http:') != 0:
	print "Must be an http url:",u
	sys.exit(1)
    return u

def takebool(b):
    if b != 'true' and b != 'false':
	print "Must be a bool: (true|false)",b
	sys.exit(1)
    return b

comment = {
	b64file:'file',
	takeurl:'url',
	takebool:'bool',
	takebmp:'bmp-file',
	None:'string'
}

options = {
    '--osearch-name': [None,['OpenSearchDescription','ShortName'],None],
    '--osearch-description': [None,['OpenSearchDescription','Description'],None],
    '--osearch-template': [None,['OpenSearchDescriptionInfo',['Url','template']],takeurl],

    '--label-name': [None,['Label','name'],None],
    '--label-icon': [None,['Label','icon'],takebmp],
    '--label-streamicon': [None,['Label','streamicon'],b64file],
    '--label-stream': [None,['Label','stream'],takeurl],

    '--rss-alias': [None,['RssFeed','alias'],None],
    '--rss-auto-download': [None,['RssFeed','auto_download'],None],
    '--rss-url': [None,['RssFeed','url'],takeurl],
    '--rss-icon': [None,['RssFeed','icon'],takebmp],
    
    '--filter-name': [None,['Filter','name'],None],
    '--filter-match-orig': [None,['Filter','match_orig_name'],None],
    '--filter-savedir': [None,['Filter','savedir'],None],
    '--filter-label': [None,['Filter','label'],None],
    '--filter-feed': [None,['Filter','feed'],takeurl],
    '--filter-mininterval': [None,['Filter','mininterval'],None],
    '--filter-icon': [None,['Filter','icon'],takebmp],

    '--autoupdate-url': [None,['AutoUpdate','url'],takeurl],
    '--app-enable-stats': [None,['AutoUpdate','stats','installed'],takebool],

    '--html': [None,['page','html'],b64file],
    '--name': [None,['page','name'],None],
    '--favicon': [None,['page','icon'],b64file],

    '--btapp': [None,None,None]
};
    
def makevalue(docelt,path,s):
    if len(path) == 0:
        docelt.appendChild(docelt.ownerDocument.createTextNode(s))
        return
    if type(path[0]) == type([]):
        thetag = path[0][0]
        attribute = path[0][1]
    else:
        thetag = path[0]
        attribute = None

    elt = None
    for child in docelt.childNodes:
        if child.nodeType == docelt.ELEMENT_NODE and child.tagName == thetag:
            elt = child
            break

    if not elt:
        elt = docelt.ownerDocument.createElement(thetag)
    if attribute:
        elt.setAttribute(attribute,s)
    else:
        if len(path) > 1:
            makevalue(elt,path[1:],s)
        else:
            elt.appendChild(docelt.ownerDocument.createTextNode(s))

    docelt.appendChild(elt)

if __name__ == '__main__':
    opt = sys.argv[1:]

    if opt == [] or opt[0] == ['--help'] or not opt[0].startswith('--'):
        print 'usage: makebtapp [options...] --btapp foo.btapp'
        print 'options:'
        for o in options.keys():
            if o != '--btapp':
		odesc = comment[options[o][2]]
                print o,'\t',odesc
    while opt != []:
        if not options.has_key(opt[0]):
            print 'Unrecognized option',opt[0]
            sys.exit(1)
        touse = opt[0]
        opt = opt[1:]
        howtouse = options[touse]
        if len(opt) == 0 or opt[0].startswith('--'):
            print 'Missing argument for opt', touse
            sys.exit(1)
        thearg = opt[0]
        opt = opt[1:]
        if howtouse[2]:
            thearg = howtouse[2](thearg)
        howtouse[0] = thearg

    # Did we get a save file?
    if not options['--btapp'][0]:
        print 'Missing output file (use --btapp)'
        sys.exit(1)

    # Did we get html at least?
    if not options['--html'][0]:
        print 'Missing html (use --html)'
        sys.exit(1)

    # Did we gate a name?
    if not options['--name'][0]:
	print 'Missing name (use --name)'	
	sys.exit(1)

    # Make sure we got at least the basic icon
    if not options['--favicon'][0]:
        print 'Missing favicon (use --favicon)'
        sys.exit(1)

    if not options['--autoupdate-url'][0]:
	print 'An autoupdate url is requred (use --autoupdate-url)'
	sys.exit(1)

    # Special case: default enable update if autoupdate url is set
    if options['--autoupdate-url'][0] and not options['--app-enable-stats'][0]:
	options['--app-enable-stats'][0] = 'true'

    domdocument = getDOMImplementation().createDocument(None, 'BtApp', None)

    for key in options.keys():
        value = options[key]
        if value[0] and value[1]:
            makevalue(domdocument.documentElement,value[1],value[0])

    open(options['--btapp'][0],'w').write(domdocument.toprettyxml())
