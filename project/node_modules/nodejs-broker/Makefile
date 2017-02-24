PATH := ./node_modules/.bin/:${PATH}

.PHONY: clean build test install publish


clean:
	rm -rf lib/
	rm -rf coverage/

build:
	coffee -o lib/ -c src/

test:
	npm test
	istanbul report text-summary


publish: build
	npm publish
