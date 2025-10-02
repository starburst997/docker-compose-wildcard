import http from 'http';

const PORT = process.env.PORT || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || 'test-server';

const server = http.createServer((req, res) => {
  const host = req.headers.host || 'unknown';
  const subdomain = host.split('.')[0];

  const response = {
    received_host: host,
    extracted_subdomain: subdomain,
    service_name: SERVICE_NAME,
    timestamp: new Date().toISOString(),
    path: req.url
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(response, null, 2));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server listening on port ${PORT}`);
  console.log(`Will respond to wildcard subdomains of ${SERVICE_NAME}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});