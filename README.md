# Docker Compose Wildcard DNS

[![Build and Test](https://github.com/starburst997/docker-compose-wildcard/actions/workflows/release.yml/badge.svg)](https://github.com/starburst997/docker-compose-wildcard/actions/workflows/release.yml)
[![Docker Image](https://img.shields.io/badge/docker-ghcr.io%2Fstarburst997%2Fdocker--compose--wildcard-blue)](https://github.com/starburst997/docker-compose-wildcard/pkgs/container/docker-compose-wildcard)

Enable wildcard subdomain resolution in Docker Compose environments with zero configuration.

## Why This Exists

Docker Compose lacks native support for wildcard DNS resolution. This becomes a problem when working with:

- **S3-compatible storage** (MinIO, LocalStack) requiring virtual-host style bucket access
- **Multi-tenant applications** where each tenant needs a subdomain
- **Microservices** that use subdomain-based routing
- **Local development** environments mimicking production wildcard certificates

This tool solves the problem by providing a lightweight DNS server that resolves `*.your-domain` to any Docker service.

## Quick Start

```yaml
services:
  dnsmasq:
    image: ghcr.io/starburst997/docker-compose-wildcard:latest
    environment:
      WILDCARD_DOMAIN: myapp # *.myapp will resolve to 'myapp' service
    cap_add:
      - NET_ADMIN
    networks:
      default:
        ipv4_address: 172.21.0.253

  myapp:
    image: nginx
    # This service will respond to: myapp, *.myapp

  client:
    image: alpine
    dns: 172.21.0.253 # Use wildcard DNS
    # Can now access: test.myapp, api.myapp, anything.myapp

networks:
  default:
    ipam:
      config:
        - subnet: 172.21.0.0/16
```

## Real-World Example: MinIO with Virtual-Host Buckets

```yaml
services:
  dnsmasq:
    image: ghcr.io/starburst997/docker-compose-wildcard:latest
    environment:
      WILDCARD_DOMAIN: minio
    cap_add:
      - NET_ADMIN
    networks:
      default:
        ipv4_address: 172.21.0.253

  minio:
    image: minio/minio
    environment:
      MINIO_DOMAIN: minio
    ports:
      - "9000:9000"

  app:
    image: your-app
    dns: 172.21.0.253
    # Can now use: bucket.minio instead of minio/bucket

networks:
  default:
    ipam:
      config:
        - subnet: 172.21.0.0/16
```

## Configuration

| Environment Variable | Description                                | Default                   |
| -------------------- | ------------------------------------------ | ------------------------- |
| `WILDCARD_DOMAIN`    | Domain for wildcard resolution             | `localhost`               |
| `TARGET_HOST`        | Service to resolve to                      | Same as `WILDCARD_DOMAIN` |
| `TARGET_IP`          | IP to resolve to (overrides `TARGET_HOST`) | -                         |
| `LOG_QUERIES`        | Enable DNS query logging                   | `yes`                     |

## Testing

Run the test suite:

```bash
docker-compose up --exit-code-from test-client
```

This will:

1. Start the DNS server
2. Start a test server
3. Verify wildcard resolution works
4. Exit with status 0 if successful

## Building From Source

```bash
# Clone the repository
git clone https://github.com/starburst997/docker-compose-wildcard.git
cd docker-compose-wildcard

# Build the image
docker build -t docker-compose-wildcard ./dnsmasq

# Run tests
docker-compose up --exit-code-from test-client
```

## How It Works

1. **dnsmasq** runs as a DNS server in your Docker network
2. It intercepts DNS queries from containers using it (`dns: 172.21.0.253`)
3. Any query matching `*.${WILDCARD_DOMAIN}` resolves to the target service
4. All other queries forward to upstream DNS (Google by default)

## Limitations

- Requires a custom network with fixed subnet (Docker Compose requirement)
- DNS server must have a fixed IP address
- Only works within the Docker network (not from host)

## Contributing

Pull requests welcome! Please ensure:

- Tests pass (`docker-compose up --exit-code-from test-client`)
- Follow existing code style
- Update documentation as needed

## License

MIT

## Credits

Created by [@starburst997](https://github.com/starburst997)
