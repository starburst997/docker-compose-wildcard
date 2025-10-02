# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of Docker Compose Wildcard DNS
- DNSMasq-based wildcard subdomain resolution
- Support for dynamic service name resolution
- Comprehensive test suite
- GitHub Actions CI/CD pipeline
- Docker image publishing to GitHub Container Registry
- Examples for common use cases (MinIO, multi-tenant apps)
- Configurable via environment variables
- Multi-architecture support (amd64, arm64)

### Features
- `WILDCARD_DOMAIN` - Configure the domain for wildcard resolution
- `TARGET_HOST` - Specify target service (defaults to WILDCARD_DOMAIN)
- `TARGET_IP` - Alternative to TARGET_HOST for static IPs
- `LOG_QUERIES` - Enable/disable DNS query logging
- Automatic service discovery within Docker networks
- Upstream DNS forwarding for non-wildcard queries

## Future Releases

Version numbers and release notes will be added here as releases are created.