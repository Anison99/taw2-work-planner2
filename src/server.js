const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

const sessionSecret = process.env.SESSION_SECRET || 'default-secret-key';


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/planner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Błąd połączenia z MongoDB:'));
db.once('open', () => {
  console.log('Połączenie z MongoDB zostało nawiązane');
});

// ------------ Definicja schematu użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  crearedAt: Date,
});

const User = mongoose.model('User', userSchema);

// ------------ Definicja schematu dla logowania użytkownika 
const workLogsSchema = new mongoose.Schema({
  userId: String,
  projectId: String,
  projectName: String,
  startTime: String,
  endTime: String,
  startBreakTime: String,
  endBreakTime: String,
});

const WorkLog = mongoose.model('WorkLogs', workLogsSchema);

// ------------ Definicja schematu dla projektów
const projectsSchema = new mongoose.Schema({
  userId: String,
  nameOfProject: String,
  description: String,
});

const Project = mongoose.model('Projects', projectsSchema);

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Invalid email' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return done(null, false, { message: 'Invalid password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const bodyParser = require('body-parser'); // Dodanie bodyParser do parsowania danych z żądania

app.use(bodyParser.urlencoded({ extended: true })); // Użycie bodyParser do parsowania formularzy

// obsługa rejestracji
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(), // Ustawienie aktualnej daty przy tworzeniu użytkownika
    });

    await newUser.save();

    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in after registration' });
      }
      return res.json({ message: 'Registration and login successful' });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error during registration' });
  }
});

// Kod obsługi logowania użytkownika
app.post('/login', async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    try {
      if (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Login failed' });
        }
        console.log('User logged in:', req.user.username);
        return res.json({ message: 'Login successful' });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error during login' });
    }
  })(req, res, next);
});

// Rejestracja projektu
app.post('/api/projects', async (req, res) => {
  try {
    const { nameOfProject, description } = req.body;
    const userId = req.isAuthenticated() ? req.user.id : null;

    const newProject = new Project({
      userId,
      nameOfProject,
      description,
    });

    await newProject.save();

    res.status(200).json({ message: 'Project save successful', projects: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Pobranie danych o projektach użytkownika
app.get('/api/user/projects', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id;

    const userProjects = await Project.find({ userId });

    if (!userProjects || userProjects.length === 0) { // Dodatkowa zmiana
      return res.status(404).json({ message: 'No projects found for this user' });
    }

    res.status(200).json({ projects: userProjects });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Error fetching user projects' });
  }
});

// Endpoint do pobierania nazwy zalogowanego użytkownika
app.get('/api/user', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Zwracanie nazwy zalogowanego użytkownika
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Endpoint do pobierania adresu email zalogowanego użytkownika
app.get('/api/user/email', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Zwracanie adresu email zalogowanego użytkownika
    res.status(200).json({ email: user.email });
  } catch (error) {
    console.error('Error fetching user email:', error);
    res.status(500).json({ message: 'Error fetching user email' });
  }
});

// Aktualizacja danych projektu
app.put('/api/projects/:projectId', async (req, res) => {
  try {
    const { nameOfProject, description } = req.body;
    const projectId = req.params.projectId;

    const updatedProject = await Project.findByIdAndUpdate(projectId, { nameOfProject, description }, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully', updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
});

//usuwanie wybranego projektu
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id;

    // Usunięcie projektu o podanym ID
    await Project.findByIdAndRemove(projectId);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});


// nasłuchiwanie serwera
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});