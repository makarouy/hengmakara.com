const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Please provide a password to hash');
  console.log('Usage: node scripts/hash-password.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Password:', password);
  console.log('Hash:', hash);
});
