const baseURL = 'http://localhost:5001/api';

async function seedAdmin() {
  try {
    const res = await fetch(`${baseURL}/auth/bootstrap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@demo.com', password: 'password123' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error');
    console.log('Admin seeded:', data);
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  }
}

seedAdmin();
