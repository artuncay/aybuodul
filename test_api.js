const { spawn } = require('child_process');
const http = require('http');

console.log('Starting ATOSIS Server API Test...');

// Start server as subprocess
const serverProcess = spawn('node', ['server.js'], {
  cwd: __dirname,
  env: { ...process.env, PORT: '3500' } // Run on test port 3500
});

serverProcess.stdout.on('data', (data) => {
  console.log(`[Server Log]: ${data.toString().trim()}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`[Server Error]: ${data.toString().trim()}`);
});

// Helper for making API calls
function request(path, method, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 3500,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (method !== 'GET') {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: data ? JSON.parse(data) : {}
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (method !== 'GET' && postData) {
      req.write(postData);
    }
    req.end();
  });
}

// Wait 1.5 seconds for server to start, then run tests
setTimeout(async () => {
  let failed = false;
  try {
    console.log('\n--- Running Test 1: Fetching Config ---');
    const configRes = await request('/api/config/categories', 'GET');
    if (configRes.statusCode === 200 && configRes.body.kat1) {
      console.log('✔ Test 1 Passed: Configuration fetched successfully.');
    } else {
      console.error('❌ Test 1 Failed:', configRes);
      failed = true;
    }

    console.log('\n--- Running Test 2: Login Admin ---');
    const loginRes = await request('/api/auth/login', 'POST', {
      email: 'admin@aybu.edu.tr',
      password: 'admin'
    });
    let adminToken = null;
    if (loginRes.statusCode === 200 && loginRes.body.token) {
      adminToken = loginRes.body.token;
      console.log('✔ Test 2 Passed: Admin logged in successfully.');
    } else {
      console.error('❌ Test 2 Failed:', loginRes);
      failed = true;
    }

    console.log('\n--- Running Test 3: Register and Login Academician ---');
    const regRes = await request('/api/auth/register', 'POST', {
      name: 'Test Akademisyen',
      email: 'academic@aybu.edu.tr',
      title: 'Doç. Dr.',
      password: 'password',
      faculty: 'Mühendislik ve Doğa Bilimleri Fakültesi',
      department: 'Bilgisayar Mühendisliği'
    });
    
    let userToken = null;
    if (regRes.statusCode === 201) {
      const loginUserRes = await request('/api/auth/login', 'POST', {
        email: 'academic@aybu.edu.tr',
        password: 'password'
      });
      if (loginUserRes.statusCode === 200 && loginUserRes.body.token) {
        userToken = loginUserRes.body.token;
        console.log('✔ Test 3 Passed: Academician registered and logged in successfully.');
      } else {
        console.error('❌ Test 3 Failed (Login):', loginUserRes);
        failed = true;
      }
    } else {
      console.error('❌ Test 3 Failed (Register):', regRes);
      failed = true;
    }

    console.log('\n--- Running Test 4: Create Application (Draft) ---');
    const appPayload = {
      year: 2025,
      category: 'kat1',
      isDraft: true,
      personalInfo: {
        name: 'Ahmet Yılmaz',
        title: 'Doç. Dr.',
        faculty: 'Mühendislik Fakültesi',
        department: 'Bilgisayar Mühendisliği',
        year: 2025
      },
      activities: [
        { activityId: 'kat1_row3', count: 2, ratio: 0.8, calculatedScore: 160 } // Makale Q1
      ],
      summary: {
        totalScore: 160
      }
    };
    
    const appRes = await request('/api/applications', 'POST', appPayload, userToken);
    if (appRes.statusCode === 201 && appRes.body.application) {
      console.log('✔ Test 4 Passed: Application created successfully.');
    } else {
      console.error('❌ Test 4 Failed:', appRes);
      failed = true;
    }

  } catch (err) {
    console.error('An error occurred during API tests:', err);
    failed = true;
  } finally {
    // Terminate server process
    serverProcess.kill();
    console.log('\nTest process finished.');
    process.exit(failed ? 1 : 0);
  }
}, 2000);
