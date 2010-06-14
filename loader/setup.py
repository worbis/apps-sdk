from distutils.core import setup
import py2exe

setup(console = ['loader.py'],
      data_files = [('.', ['../dist/griffin-0.1-py2.6.egg'])]
      )
