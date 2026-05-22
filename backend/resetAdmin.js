require("dotenv").config();
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

async function run() {
  try {
    let admin = await Admin.findOne();
    const newPassword = "admin";
    const passwordHash = await bcrypt.hash(newPassword, 10);

    if (admin) {
        admin.passwordHash = passwordHash;
        await admin.save();
        console.log("===================================");
        console.log("✅ Admin password reset successfully!");
        console.log(`Email: ${admin.email}`);
        console.log(`Password: ${newPassword}`);
        console.log("===================================");
    } else {
        const email = "admin@portfolio.com";
        await Admin.create({ email, passwordHash });
        console.log("===================================");
        console.log("✅ Admin account created successfully!");
        console.log(`Email: ${email}`);
        console.log(`Password: ${newPassword}`);
        console.log("===================================");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error resetting admin:", err.message);
    process.exit(1);
  }
}

run();
