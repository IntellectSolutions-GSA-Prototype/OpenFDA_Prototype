FROM node:latest

# Install dependencies
RUN apt-get update -y
RUN apt-get install apt-utils -y
RUN apt-get upgrade -y

# Install OpenFDA Application
COPY ./openfda/ /usr/src/myapp

EXPOSE 8000

CMD [ "node", "/usr/src/myapp/server.js" ]
