#!/bin/sh
#
# Assumptions:
# - user is in docker group or script must be executed using SUDO to properly bind ports
# - /var/certs is repository for required SSL/TLS Certificates
#
# Define Script Variables
CERT_DIR="/var/certs"
DOCKERAPP="/usr/bin/docker"
USERNAME=`whoami`

# Validate Assumptions

if [ $USERNAME = root ] || [ `grep $USERNAME /etc/group | grep docker` ]; then
        echo "$USERNAME access rights passed"
else
        echo "$USERNAME access rights not correct, please add user to docker group or run script using SUDO"
fi

if [ -e $CERT_DIR/server.crt ] && [ -e $CERT_DIR/server.key ] && [ -e $CERT_DIR/server-ca.crt ]; then
        echo "All required certificates are present in $CERT_DIR"
else
        echo "Required certificate files are not present in $CERT_DIR, please correct before proceeding"
fi

$DOCKERAPP run -p 80:80 -p 443:443 -v /var/certs:/var/certs -d intellectsolutionsllc/openfda_httpd
$DOCKERAPP run -p 8000:8000 -v /var/certs:/var/certs -d intellectsolutionsllc/openfda_nodejs

