#!/bin/bash
dir_test=./node_modules

if [ ! -d $dir_test ]
then
  echo "NPM UPDATE!"
  npm install
fi

echo "DEV MODE ::."
  npm run dev
