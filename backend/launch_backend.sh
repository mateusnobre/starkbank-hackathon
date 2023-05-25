#!/bin/bash

# start backend flask server
gunicorn flask_server:app
echo "flask_server running..."
