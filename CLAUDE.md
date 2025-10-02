# Docker Compose Wildcard DNS - Technical Documentation

## Purpose

Provides wildcard subdomain resolution for Docker Compose environments. Solves the limitation where Docker Compose cannot natively resolve `*.domain` patterns.

## Core Problem Solved

Docker Compose services need to respond to dynamic subdomains (e.g., `bucket.minio`, `tenant1.app`, `api.service`) without pre-defining each subdomain. Essential for S3-compatible storage, multi-tenant apps, and microservices.

## Architecture

```
Container (dns: 172.21.0.253) → DNSMasq → Resolves *.domain → Target Service IP
```

## Key Components

### `/dnsmasq/`

- **Dockerfile**: Alpine-based dnsmasq container
- **start-dnsmasq.sh**: Configures wildcard resolution based on ENV vars
- Resolves service names to IPs dynamically
- Forwards non-wildcard queries to upstream DNS (8.8.8.8)

### `/test/`

- **server.js**: Echo server that returns the subdomain it received
- **client.js**: Validates DNS resolution and HTTP requests work
- Tests multiple random subdomains to ensure wildcards work

## Configuration

| Variable          | Purpose               | Default                   |
| ----------------- | --------------------- | ------------------------- |
| `WILDCARD_DOMAIN` | Domain to wildcard    | `localhost`               |
| `TARGET_HOST`     | Service to resolve to | Same as `WILDCARD_DOMAIN` |
| `LOG_QUERIES`     | DNS query logging     | `yes`                     |

## Docker Compose Requirements

```yaml
services:
  dnsmasq:
    image: ghcr.io/starburst997/docker-compose-wildcard:latest
    environment:
      WILDCARD_DOMAIN: myservice
    networks:
      default:
        ipv4_address: 172.21.0.253 # Fixed IP required

  myservice:
    image: app
    # Responds to: *.myservice

  client:
    dns: 172.21.0.253 # Must use IP, not service name

networks:
  default:
    ipam:
      config:
        - subnet: 172.21.0.0/16 # Required for fixed IPs
```

## Technical Constraints

1. **Fixed IP Required**: Docker Compose `dns:` field only accepts IPs, not service names
2. **Network Definition**: Must define subnet to assign fixed IPs
3. **Container-Only**: Works within Docker network, not from host

## CI/CD

- **GitHub Actions**: Tests on push, builds multi-arch images (amd64/arm64)
- **Registry**: Publishes to `ghcr.io/starburst997/docker-compose-wildcard`
- **Versioning**: Semantic versioning with git tags (v1.0.0)

## Testing

```bash
docker-compose up --exit-code-from test-client
```

Validates:

1. DNS resolution of random subdomains
2. HTTP requests reach correct service
3. Subdomain extraction works correctly

## Common Use Cases

1. **S3 Virtual Host Style**: `bucket.minio` instead of `minio/bucket`
2. **Multi-tenant SaaS**: `customer1.app`, `customer2.app`
3. **Microservices**: `api.backend`, `auth.backend`, `db.backend`

## Image Details

- Base: `alpine:latest` (minimal size)
- Size: ~8MB
- Architecture: Multi-arch (amd64, arm64)
- Entry: `start-dnsmasq.sh` generates config dynamically
