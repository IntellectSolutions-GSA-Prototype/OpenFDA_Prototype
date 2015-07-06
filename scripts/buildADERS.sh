#!/bin/sh
#
# Assumptions:
# - user is in docker group or script must be executed using SUDO to properly bind ports
# - git applications installed
#
# Define Script Variables
GIT_REPOSITORY=$HOME/gitRepository
DOCKERAPP="/usr/bin/docker"
GITAPP="/usr/bin/git"
USERNAME=`whoami`

# Validate Assumptions

if [ $USERNAME = root ] || [ `grep $USERNAME /etc/group | grep docker` ]; then
        echo "$USERNAME access rights passed"
else
        echo "$USERNAME access rights not correct, please add user to docker group or run script using SUDO"
fi

if [ -d $GIT_REPOSITORY ]; then
	echo "$GIT_REPOSITORY Available"
else
	mkdir $GIT_REPOSITORY
	echo "$GIT_REPOSITORY Created"
fi

# Clone and update local git Repository
$GITAPP clone --depth 1 git://github.com/IntellectSolutions-GSA-Prototype/OpenFDA_Prototype.git $GIT_REPOSITORY -b 1.0
cd $GIT_REPOSITORY
$GITAPP fetch && $GITAPP reset --hard origin/1.0

# Build Docker Images
cd $GIT_REPOSITORY/Front\ End
$DOCKERAPP build --tag intellectsolutionsllc/openfda_httpd .
cd $GIT_REPOSITORY/Back\ End/NodeJS\ Files
$DOCKERAPP build --tag intellectsolutionsllc/openfda_nodejs .
echo "Docker Images Compiled."
$DOCKERAPP images
