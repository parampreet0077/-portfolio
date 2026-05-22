const axios = require('axios');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const secret = process.env.JWT_SECRET || 'your_super_secret_key_here';
const token = jwt.sign({ id: 'demo123', email: 'admin@demo.com' }, secret, { expiresIn: '1h' });

const api = axios.create({
  baseURL: 'http://localhost:5001/api'
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

async function test() {
  try {
    const FormData = require('form-data');
    const fd = new FormData();
    fd.append('title', 'Test');
    fd.append('category', 'Frontend');
    fd.append('status', 'Completed');
    fd.append('techStack', JSON.stringify(['React']));

    // Send without manual headers, relying on form-data boundary logic internally, but axios handles form-data headers automatically in newer versions OR we must pass fd.getHeaders()
    // Wait, the frontend uses native Web FormData, so Axios handles it natively without .getHeaders().
    // We will test both to see if we get a 401.

    console.log("Sending POST to /projects");
    const { data } = await api.post('/projects', fd, { headers: fd.getHeaders() });
    console.log('Success:', data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.status + ' ' + JSON.stringify(err.response.data) : err.message);
  }
}

test();
