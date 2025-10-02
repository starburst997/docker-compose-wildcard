# Contributing to Docker Compose Wildcard DNS

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/docker-compose-wildcard.git
   cd docker-compose-wildcard
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

Build the images locally:
```bash
make build
```

Run tests:
```bash
make test
```

## Making Changes

### Code Structure

- `/dnsmasq/` - DNS server Docker image
  - `Dockerfile` - Container definition
  - `start-dnsmasq.sh` - Startup script
- `/test/` - Test suite
  - `server.js` - Test server that responds to subdomains
  - `client.js` - Test client that verifies DNS resolution
- `/examples/` - Usage examples

### Testing

All changes must pass the test suite:
```bash
make test
```

For debugging, keep containers running:
```bash
make debug
```

### Code Style

- Shell scripts: Use shellcheck
- JavaScript: Use standard Node.js conventions
- YAML: Use 2-space indentation

## Submitting Changes

1. Ensure all tests pass
2. Update documentation if needed
3. Commit your changes:
   ```bash
   git commit -m "feat: add new feature"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a Pull Request

## Commit Message Format

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test updates
- `chore:` - Maintenance tasks

## Pull Request Guidelines

- Describe what changes you made
- Explain why the changes are needed
- Reference any related issues
- Ensure CI checks pass

## Reporting Issues

- Use GitHub Issues
- Include Docker and Docker Compose versions
- Provide minimal reproduction steps
- Include relevant error messages

## Questions?

Open a GitHub issue with the `question` label.