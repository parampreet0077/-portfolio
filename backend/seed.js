const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'your_super_secret_key_here';
const token = jwt.sign({ id: 'demo123', email: 'admin@demo.com' }, secret, { expiresIn: '1h' });

const baseURL = 'http://localhost:5001/api';

async function apiCall(path, data, isFormData = false) {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  if (isFormData) {
    options.body = data;
  } else {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${baseURL}${path}`, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function seed() {
  try {
    // 1. Seed About
    const aboutData = {
      fullName: "Jane Doe",
      title: "Senior Full Stack Developer",
      shortBio: "Building scalable web apps.",
      experienceYears: 5,
      location: "San Francisco, CA"
    };
    await apiCall('/about', aboutData);
    console.log('Seeded About');

    // 2. Seed Skills
    const skillData = {
      skillName: "React",
      percentage: 90,
      category: "Frontend",
      experienceLevel: "Expert"
    };
    await apiCall('/skills', skillData);
    console.log('Seeded Skills');

    // 3. Seed Projects
    const fd = new FormData();
    fd.append('title', 'Demo Portfolio');
    fd.append('category', 'Frontend');
    fd.append('status', 'Completed');
    fd.append('techStack', JSON.stringify(['React', 'Node']));
    await apiCall('/projects', fd, true);
    console.log('Seeded Projects');

    console.log('Demo data seeded successfully!');
  } catch (err) {
    console.error('Error seeding data:', err.message);
  }
}

seed();
