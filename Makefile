.DEFAULT_GOAL := all

.PHONY: build run all

build:
	node src/index.js test.sl
	gcc test.c -o test
	./test

all: build run