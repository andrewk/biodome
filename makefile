RUNNER = ./node_modules/.bin/mocha

test:
	@NODE_ENV=test $(RUNNER) \
		--recursive \
		--reporter spec

test-watch:
	@NODE_ENV=test $(RUNNER) \
		--recursive \
		--reporter dot \
		--growl \
		--watch

.PHONY: test test-watch
