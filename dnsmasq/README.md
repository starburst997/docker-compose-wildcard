# DNSMasq Wildcard DNS Container

This directory contains the Docker image source for the wildcard DNS resolver.

## Building

```bash
docker build -t docker-compose-wildcard .
```

## Configuration

See the main [README](../README.md) for configuration options.

## Files

- `Dockerfile` - Container definition
- `start-dnsmasq.sh` - Startup script that configures dnsmasq based on environment variables
- `.dockerignore` - Build exclusions

## How It Works

The container runs dnsmasq with a dynamically generated configuration based on environment variables. The `start-dnsmasq.sh` script:

1. Resolves the target service name to an IP address
2. Configures dnsmasq to resolve `*.${WILDCARD_DOMAIN}` to that IP
3. Starts dnsmasq with the generated configuration

This allows any subdomain of the configured domain to resolve to the target service within the Docker network.