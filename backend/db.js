const fs = require('fs-extra');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const db = fs.readJsonSync(dbPath);

module.exports = db;
