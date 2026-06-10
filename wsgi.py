"""WSGI entry point for PythonAnywhere deployment.

Instructions:
1. On PythonAnywhere, go to Web tab > WSGI configuration file
2. Replace its contents with:
     import sys
     sys.path.insert(0, '/home/YOUR_USERNAME/lakshmipur-bostraloy')
     from wsgi import app
3. Replace YOUR_USERNAME with your PythonAnywhere username
"""
from app import app

if __name__ == "__main__":
    app.run()
