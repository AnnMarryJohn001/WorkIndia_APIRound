const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'MyNewPass',
  database: 'IRCTC',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error: ', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Define API routes for CRUD operations (Create, Read, Update, Delete)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend.html')); 
  });
  app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); 
  });
  app.get('/registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration.html')); 
  });
  app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html')); 
  });
  app.get('/welcome.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html')); 
  });
  app.get('/adminwelcome.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'adminwelcome.html')); 
  });
  app.get('/adminregistration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'adminregistration.html')); 
  });


  app.post('/api/users', (req, res) => {
    const { username, password, email } = req.body;
  
    // Generate a salt and hash the user's password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Password hashing error:', err);
        return res.status(500).json({ error: 'Unable to create user' });
      }
  
      const insertQuery = 'INSERT INTO user (username, password, email) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, hashedPassword, email], (err, result) => {
        if (err) {
          console.error('Error creating user: ', err);
          res.status(500).json({ error: 'Unable to create user' });
        } else {
          res.status(201).json({ message: 'User created successfully' });
        }
      });
    });
  });


  app.post('/api/adminreg', (req, res) => {
    const { username, password, email } = req.body;
  
    // Generate a salt and hash the user's password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Password hashing error:', err);
        return res.status(500).json({ error: 'Unable to create user' });
      }
  
      const insertQuery = 'INSERT INTO admin (username, password, email) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, hashedPassword, email], (err, result) => {
        if (err) {
          console.error('Error creating user: ', err);
          res.status(500).json({ error: 'Unable to create user' });
        } else {
          res.status(201).json({ message: 'User created successfully' });
        }
      });
    });
  });


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM user WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (results.length === 1) {
      // User exists, compare hashed passwords
      const hashedPassword = results[0].password;

      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error('Password comparison error:', err);
          return res.status(500).json({ error: 'Login failed' });
        }

        if (isMatch) {
          // Passwords match, user is authenticated
          return res.status(200).json({ message: 'Login successful' });
        } else {
          // Passwords do not match
          return res.status(401).json({ error: 'Invalid username or password' });
        }
      });
    } else {
      // User not found
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});





app.post('/api/admin', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM admin WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (results.length === 1) {
      // User exists, compare hashed passwords
      const hashedPassword = results[0].password;

      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error('Password comparison error:', err);
          return res.status(500).json({ error: 'Login failed' });
        }

        if (isMatch) {
          // Passwords match, user is authenticated
          return res.status(200).json({ message: 'Login successful' });
        } else {
          // Passwords do not match
          return res.status(401).json({ error: 'Invalid username or password' });
        }
      });
    } else {
      // User not found
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});





app.post('/api/train', (req, res) => {
  // Implement the logic to create a new note
  const { name,source,dest,seat,sourcetime,desttime } = req.body;

  const insertQuery = 'INSERT INTO train (name,source,dest,seat,sourcetime,desttime) VALUES (?, ?,?,?,?,?)';
  console.log(req.body);
  
  db.query(insertQuery, [name,source,dest,seat,sourcetime,desttime], (err, result) => {
    if (err) {
      console.error('Error creating note: ', err);
      res.status(500).json({ error: 'Unable to add train' });
    } else {
      res.status(201).json({ message: 'Train added succesfully' });
    }
  });
});



app.get('/api/searchtrains', (req, res) => {
  const { source, destination } = req.query;

  const query = 'SELECT * FROM train WHERE source = ? AND dest = ?';
  db.query(query, [source, destination], (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ error: 'Train search failed' });
      }

      res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
