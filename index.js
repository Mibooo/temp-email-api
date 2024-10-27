const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load temporary email domains from the .txt file
let tempEmailDomains = new Set();
const filePath = path.join(__dirname, 'temp_email_domains.txt');
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading temp_email_domains.txt:', err);
  } else {
    tempEmailDomains = new Set(data.split('\n').map(domain => domain.trim().toLowerCase()));
  }
});

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to check if an email is temporary
app.post('/check_email', (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    // Validate email format
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Extract domain from email
    const domain = email.split('@').pop();

    // Check if the email domain is in the temporary list
    if (tempEmailDomains.has(domain)) {
      return res.status(200).json({ is_temporary: true });
    } else {
      return res.status(200).json({ is_temporary: false });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
