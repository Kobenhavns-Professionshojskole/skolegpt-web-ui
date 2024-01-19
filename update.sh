#!/bin/bash

# List all the detached screen sessions
detached_screens=$(screen -ls | grep Detached)

# Check if there are any detached screens
if [ -z "$detached_screens" ]; then
    echo "No detached screen sessions found."
else 
    # Get the ID of the first detached session
    session_id=$(echo "$detached_screens" | head -n 1 | awk -F '.' '{print $1}')
    echo "Found detached session ID: $session_id"

    # Send the quit command to the screen session
    screen -S $session_id -X quit
    echo "Terminated screen session with ID: $session_id"
fi

# Pull the latest code from the git repository
git pull

# Install
npm install

# Build the project using npm
npm run build

# Start the project using npm
screen -dm npm run start
