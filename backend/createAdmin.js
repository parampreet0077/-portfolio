require("dotenv").config();
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

async function run() {
  try {
    const email = "admin@portfolio.com";
    const password = "admin";

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        console.log("Admin account already exists!");
        console.log(`Email: ${email}`);
        console.log(`Password: (the one you set previously, try 'admin')`);
        process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash });
    
    console.log("===================================");
    console.log("✅ Admin account created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("===================================");
    
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

run();
