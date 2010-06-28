#
# Copyright (c) 2010 BitTorrent Inc.
#

import codecs
import gettext
import json
import logging
import os
import shutil
import apps.command.base
import apps.config

class localize(apps.command.base.Command):

    user_options = [
        ('dir=', 'd', 'translation file directory', None),
        ('remove', 'r', 'remove .po files from original location', None)
                   ]
    option_defaults = { 'dir': 'lang' }
    help = 'Generate JSON for localization from a directory of .po and ' \
        '.mo files.'

    def run(self):
        if not os.path.exists(os.path.join(self.project.path,
                                           self.options['dir'])):
            logging.error('The directory "%s" does not exist.' % (
                    self.options['dir'], ))
            return
        path = os.path.join(self.project.path, self.options['dir'])
        for item in os.listdir(path):
            ext = os.path.splitext(item)[1]
            lang = os.path.splitext(item)[0]
            if os.path.exists(os.path.join(path, lang)) == False and \
                    (ext == ".mo" or ext == ".po"):
                os.makedirs(os.path.join(path, lang, "LC_MESSAGES"))
            if ext == ".po":
                shutil.copy(os.path.join(path, item),
                            os.path.join(path, lang, item))
                if self.options.get('remove', None):
                    os.remove(os.path.join(path, item))
            elif ext == ".mo":
                shutil.copy(os.path.join(path, item), os.path.join(
                        path, lang, "LC_MESSAGES", item))
                if self.options.get('remove', None):
                    os.remove(os.path.join(path, item))

                fobj = codecs.open(os.path.join(path, lang, lang+".js"), "wb",
                                   "utf-8")
                tr = gettext.translation(lang, path, [lang])
                ret = {}
                for k, v in tr._catalog.iteritems():
                    if type(k) is tuple:
                        if k[0] not in ret:
                            ret[k[0]] = []
                        ret[k[0]].append(v)
                    else:
                        ret[k] = v
                fobj.write(json.dumps(ret, ensure_ascii=False, indent=False))
                fobj.close()
                logging.info("Successfully processed JSON for language: %s" % (
                        lang,))
