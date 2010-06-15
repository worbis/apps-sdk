from distutils.core import setup
import py2exe

setup(console = ['apps.py'],
      data_files = [('.', ['../dist/griffin-0.1-py2.6.egg'])],
      options = { 'py2exe': { "unbuffered": True,
                              "optimize": 2,
                              "includes": [ 'email' ],
                              "packages": ["mako.cache", "email"],
                              }
                }
      )
