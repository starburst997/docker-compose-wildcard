import http from 'http';
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

const TARGET_SERVICE = process.env.TARGET_SERVICE || 'test-server';
const TARGET_PORT = process.env.TARGET_PORT || '3000';
const TEST_DELAY = parseInt(process.env.TEST_DELAY || '5000');

// Test subdomains
const TEST_SUBDOMAINS = [
  'test',
  'app',
  'api',
  'admin',
  'user-123',
  'tenant-abc',
  'random-' + Math.random().toString(36).substring(7)
];

// Color output for better visibility
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

async function testDNSResolution() {
  console.log('\n📡 Testing DNS Resolution');
  console.log('=' .repeat(50));

  let allPassed = true;

  for (const subdomain of TEST_SUBDOMAINS) {
    const hostname = `${subdomain}.${TARGET_SERVICE}`;
    try {
      const result = await lookup(hostname);
      console.log(`${colors.green}✓${colors.reset} ${hostname} → ${result.address}`);
    } catch (err) {
      console.log(`${colors.red}✗${colors.reset} ${hostname} → ${err.message}`);
      allPassed = false;
    }
  }

  return allPassed;
}

async function testHTTPRequests() {
  console.log('\n🌐 Testing HTTP Requests');
  console.log('=' .repeat(50));

  let allPassed = true;

  for (const subdomain of TEST_SUBDOMAINS) {
    const hostname = `${subdomain}.${TARGET_SERVICE}`;

    await new Promise((resolve) => {
      const options = {
        hostname: hostname,
        port: TARGET_PORT,
        path: '/test',
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.extracted_subdomain === subdomain) {
              console.log(`${colors.green}✓${colors.reset} ${hostname} → Subdomain verified: ${response.extracted_subdomain}`);
            } else {
              console.log(`${colors.red}✗${colors.reset} ${hostname} → Subdomain mismatch: expected ${subdomain}, got ${response.extracted_subdomain}`);
              allPassed = false;
            }
          } catch (e) {
            console.log(`${colors.red}✗${colors.reset} ${hostname} → Invalid response: ${e.message}`);
            allPassed = false;
          }
          resolve();
        });
      });

      req.on('error', (err) => {
        console.log(`${colors.red}✗${colors.reset} ${hostname} → Request failed: ${err.message}`);
        allPassed = false;
        resolve();
      });

      req.on('timeout', () => {
        console.log(`${colors.red}✗${colors.reset} ${hostname} → Request timeout`);
        req.destroy();
        allPassed = false;
        resolve();
      });

      req.end();
    });
  }

  return allPassed;
}

async function runTests() {
  console.log('🧪 Docker Compose Wildcard DNS Test Suite');
  console.log('=' .repeat(50));
  console.log(`Target: ${TARGET_SERVICE}`);
  console.log(`Port: ${TARGET_PORT}`);
  console.log(`Test delay: ${TEST_DELAY}ms`);

  // Wait for services to be ready
  console.log(`\n⏳ Waiting ${TEST_DELAY}ms for services to start...`);
  await new Promise(resolve => setTimeout(resolve, TEST_DELAY));

  // Run tests
  const dnsOk = await testDNSResolution();
  const httpOk = await testHTTPRequests();

  // Results
  console.log('\n📊 Test Results');
  console.log('=' .repeat(50));

  if (dnsOk && httpOk) {
    console.log(`${colors.green}✓ All tests passed!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Some tests failed${colors.reset}`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});