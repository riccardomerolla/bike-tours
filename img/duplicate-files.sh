#!/bin/bash

# A script to find files that share a name but have different extensions.

echo "Searching for duplicates..."
echo "--------------------------"

# Use an associative array to store basenames we have already processed.
declare -A processed_names

# Loop through every file in the directory.
for file in *.*; do
    # Get the filename without its extension (the "basename").
    basename="${file%.*}"

    # If we haven't already processed this basename...
    if [[ -z "${processed_names[$basename]}" ]]; then
        # Find all files that start with this basename.
        matches=( "$basename".* )

        # If more than one file is found, they are a duplicate set.
        if [ "${#matches[@]}" -gt 1 ]; then
            echo "Duplicate set found for: '$basename'"
            for item in "${matches[@]}"; do
                echo "  - $item"
            done
            echo "" # Add a blank line for readability.
        fi

        # Mark this basename as processed so we don't check it again.
        processed_names["$basename"]=1
    fi
done

echo "--------------------------"
echo "Search complete."
