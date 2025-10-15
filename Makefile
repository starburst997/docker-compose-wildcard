.PHONY: build test clean release help

# Default target
.DEFAULT_GOAL := help

# Build the Docker images
build:
	@echo "Building Docker images..."
	@docker-compose build

# Run tests
test:
	@echo "Running test suite..."
	@docker-compose up --exit-code-from test-client test-client

# Clean up containers and networks
clean:
	@echo "Cleaning up..."
	@docker-compose down -v
	@docker-compose rm -f

# Run tests and keep containers running for debugging
debug:
	@echo "Starting services for debugging..."
	@docker-compose up

# Show logs
logs:
	@docker-compose logs -f

# Display help
help:
	@echo "Docker Compose Wildcard DNS - Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  build    - Build Docker images"
	@echo "  test     - Run test suite"
	@echo "  clean    - Clean up containers and networks"
	@echo "  debug    - Run services with logs for debugging"
	@echo "  logs     - Show service logs"
	@echo "  help     - Show this help message"
	@echo ""
	@echo "Examples:"
	@echo "  make build"
	@echo "  make test"