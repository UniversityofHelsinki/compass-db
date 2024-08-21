#!/bin/sh

# Log start of script
echo "Starting initialization script..."

# List contents of the mounted config directory for debug purposes
echo "Listing contents of /shib-config:"
ls /shib-config

# Check if the files exist before copying
if [ -f /shib-config/shibboleth2.xml ]; then
    echo "Copying shibboleth2.xml"
    cp /shib-config/shibboleth2.xml /etc/shibboleth/shibboleth2.xml
else
    echo "shibboleth2.xml not found"
fi

if [ -f /shib-config/attribute-map.xml ]; then
    echo "Copying attribute-map.xml"
    cp /shib-config/attribute-map.xml /etc/shibboleth/attribute-map.xml
else
    echo "attribute-map.xml not found"
fi

# Log completion of script
echo "Initialization complete. Starting main application..."
