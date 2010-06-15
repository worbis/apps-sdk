python setup.py py2exe
python lib.py
PYTHONPATH=dist/ easy_install-2.6 -d dist -z -U -a ../dist/griffin-0.1-py2.6.egg
