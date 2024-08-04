const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'db.json');

const hashPasswords = async () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const db = JSON.parse(data);

    for (const user of db.users) {
      if (!user.password.startsWith('$2a$')) { // Check if password is already hashed
        user.password = await bcrypt.hash(user.password, 10);
      }
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    console.log('Passwords hashed and db.json updated');
  } catch (error) {
    console.error('Error hashing passwords:', error);
  }
};

hashPasswords();
