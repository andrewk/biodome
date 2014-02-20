RUNNER = ./node_modules/.bin/mocha

test:
	@NODE_ENV=test $(RUNNER) 

test-watch:
	@NODE_ENV=test $(RUNNER) \
		--reporter dot \
		--growl \
		--watch

.PHONY: test test-watch
