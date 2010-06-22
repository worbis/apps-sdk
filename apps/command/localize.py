#
# Copyright (c) 2010 BitTorrent Inc.
#

import apps.command.base
import apps.config
import os, logging, shutil, codecs, gettext
import json as enc

class localize(apps.command.base.Command):

    user_options = [ 
        ('dir=', 'd', 'translation file directory', None),
        ('remove', 'r', 'remove .po files from original location', None)
                   ]
    option_defaults = { 'dir': 'lang' }
    help = 'Generate JSON for localization from a directory of .po and .mo files.'

    def run(self):

        if not os.path.exists(os.path.join(self.project.path, self.options['dir'])):
            logging.error('The directory "'+self.options['dir']+'" does not exist.')
            return
        path = os.path.join(self.project.path, self.options['dir'])
        for item in os.listdir(path):  
            ext = os.path.splitext(item)[1]
            lang = os.path.splitext(item)[0]
            if os.path.exists(path+"/"+lang)==False and (ext==".mo" or ext==".po"):
                os.makedirs(path+"/"+lang+"/LC_MESSAGES")
            if ext == ".po":
                shutil.copy(path+"/"+item, path+"/"+lang+"/"+item)
                if self.options.get('remove', None):
                    os.remove(path+"/"+item)
            elif ext == ".mo":
                shutil.copy(path+"/"+item, path+"/"+lang+"/LC_MESSAGES/"+item)
                if self.options.get('remove', None):
                    os.remove(path+"/"+item)

                file = codecs.open(path+"/"+lang+"/"+lang+".js", "w", "utf-8")
                tr = gettext.translation(lang, path, [lang])
                keys = tr._catalog.keys()
                keys.sort()
                ret = {}
                for k in keys:
                    v = tr._catalog[k]
                    if type(k) is tuple:
                        if k[0] not in ret:
                            ret[k[0]] = []
                        ret[k[0]].append(v)
                    else:
                        ret[k] = v
                file.write(enc.dumps(ret, ensure_ascii = False, indent = False))
                file.close()
                logging.info("Successfully processed JSON for language: "+lang)