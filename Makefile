NPM ?= npm

.PHONY: run-server stop-server restart-server build dist watch clean help

## run-server: starts the server.
run-server:
		@echo Running mattermost for development
		./run-server.sh

## stop-server: stops the server
stop-server:
		@echo Stopping mattermost for development
		./stop-server.sh

## restart-server: restarts the server.
restart-server:
		@echo Stopping mattermost for development
		./stop-server.sh
		@echo Running mattermost for development
		./run-server.sh

## build: build the app
build: node_modules
	$(NPM) run build

## dist: creates the bundle file
dist: build
	cp -r node_modules dist;  cd dist; zip -qr js-function *; cp ../src/manifest.json .; cp -r ../static .;  zip -r bundle.zip js-function.zip manifest.json static/

## build: build the app when changed
watch: node_modules
	$(NPM) run build:watch

## clean: deletes all
clean:
	$(NPM) run clean

## node_modules: ensures NPM dependencies are installed without having to run this all the time
node_modules: $(wildcard package.json)
	$(NPM) install
	touch $@

help: ## help: prints this help message
	@echo "Usage:"
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'