python setup.py develop
python setup.py bdist_egg
cd loader/
python setup.py py2exe
python lib.py
PYTHONPATH=dist/ easy_install-2.6 -d dist -zUax ../dist/griffin-0.1-py2.6.egg
