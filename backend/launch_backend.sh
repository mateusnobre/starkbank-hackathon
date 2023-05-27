#!/bin/bash

# start backend flask server
gunicorn app:app
echo "app running..."
