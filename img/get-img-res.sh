#!/bin/bash

# A script to list the resolution of image files in the current directory.

echo "Image Resolutions (Filename: Width x Height)"
echo "------------------------------------------"

for file in *.jpg *.jpeg *.png *.gif; do
  # Check if any files match the pattern to avoid errors
  if [ -e "$file" ]; then
    identify -format '%f: %w x %h\n' "$file"
  fi
done
