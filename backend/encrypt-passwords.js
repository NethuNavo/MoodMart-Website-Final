require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function encryptPasswords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moodmart');
    console.log('✓ Connected to MongoDB');

    // Find all users with plain-text passwords
    const users = await User.find();
    let updatedCount = 0;

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, $2x$, or $2y$)
      if (!user.password.startsWith('$2')) {
        console.log(`Encrypting password for user: ${user.email}`);
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        updatedCount++;
      }
    }

    console.log(`✓ Successfully encrypted ${updatedCount} passwords`);
    console.log(`✓ Total users: ${users.length}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error encrypting passwords:', err.message);
    process.exit(1);
  }
}

encryptPasswords();
