FROM httpd:latest

# Install dependencies
RUN apt-get update -y
RUN apt-get install apt-utils -y
RUN apt-get upgrade -y

# Install OpenFDA Application
COPY ./config/docker-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./config/docker-httpd-ssl.conf /usr/local/apache2/conf/extra/httpd-ssl.conf
#COPY ./config/certs/server.crt /usr/local/apache2/conf/server.crt
#COPY ./config/certs/server.key /usr/local/apache2/conf/server.key
#COPY ./config/certs/server-ca.crt /usr/local/apache2/conf/server-ca.crt
RUN rm -rf /usr/local/apache2/htdocs/*
COPY ./openfda/ /usr/local/apache2/htdocs/

EXPOSE 80 443
