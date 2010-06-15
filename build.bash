python setup.py develop
python setup.py bdist_egg
cd loader/
rm -rf dist/
python setup.py py2exe
mv dist/apps-sdk.exe dist/apps.exe
python lib.py
PYTHONPATH=dist/ easy_install-2.6 -d dist -zUax ../dist/*.egg
