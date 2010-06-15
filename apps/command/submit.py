#
# Copyright (c) 2010 BitTorrent Inc.
#

import DNS
import email.mime.base
import email.mime.text
import email.mime.application
import os
import smtplib

import griffin.command.base

class submit(griffin.command.base.Command):

    user_options = [ ('user=', None, 'username to submit under', None),
                     ('rcpt=', None, 'location to submit to', None),
                     ]
    pre_commands = [ 'package' ]
    option_defaults = { 'rcpt': 'thomas@bittorrent.com' }
    help = 'Submit a package or app for inclusion in the marketplace.'

    def run(self):
        if not self.options.get('user', None):
            logging.error(
                'Need to include --user to report who the submissions is from.')
            return
        domain = self.options['rcpt'].split('@')[-1]
        mx = DNS.mxlookup(domain)
        if not mx:
            logging.error("Can't get an MX for %s" % (domain,))
            return
        server = smtplib.SMTP(mx[0][1])
        text = email.mime.text.MIMEText('Package submission from %s for %s' % (
                self.options['user'],self.project.metadata['name']))
        btapp = email.mime.application.MIMEApplication(
            open(os.path.join('dist', '%s.btapp' % (
                        self.project.metadata['name'],)), 'rb').read(),
            'zip', name='%s.btapp' % self.project.metadata['name'])
        msg = email.mime.base.MIMEBase('multipart', 'mixed')
        msg.add_header('Subject', 'Submission of %s for %s' % (
                self.project.metadata['name'], self.options['user']))
        msg.add_header('From', self.options['user'])
        msg.add_header('To', self.options['rcpt'])
        msg.attach(text)
        msg.attach(btapp)
        server.sendmail(self.options['user'], self.options['rcpt'],
                        str(msg))
        server.quit()
