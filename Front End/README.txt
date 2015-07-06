Purpose: Only Front End files related to the ADERS OpenFDA Application should be put here.

The files here are those used to create the Docker Repository (intellectsolutionsllc/openfda_httpd)

Assumptions for installation (based on Information documented at Docker Repository:
	- The required SSL/TLS Certificates for supporting the HTTPS connection are available in /var/certs

To build the docker component (assumes a docker environment is already installed):
	git clone --depth 1 git://github.com/IntellectSolutions-GSA-Prototype/OpenFDA_Prototype.git ~/gitRepository/ -b 1.0
	cd ~/gitRepository
	git fetch && git reset --hard origin/1.0
	cd ~/gitRepository/Front\ End/
	docker build --tag=openfda_httpd .

Note: Authorized contributors should tag the docker image as intellectsolutionsllc/openfda_httpd
Authorized contributors can upload the resulting updated docker image using the following commands
	docker login
		{Respond to username, password, and email prompts to login to the Docker Repository site}
	docker push intellectsolutionsllc/openfda_httpd



