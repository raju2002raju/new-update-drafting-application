require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://royr55601:royr55601@cluster0.xra8inl.mongodb.net/legaldrafting', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  // Start the server after successful connection to MongoDB
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Routes
const transcriptionRoutes = require('./Routes/transcription');
const promptRoutes = require('./Routes/promptRoutes');
const apiRoutes = require('./Routes/sectionRoutes');
const backendRoutes = require('./Routes/Backendaudiioprocessing'); // Corrected spelling for consistency
const updateprompts = require('./Routes/updateprompts');

app.use('/api', apiRoutes);
app.use('/api', transcriptionRoutes);
app.use('/api', promptRoutes); // Fixed route path from `/apii` to `/api`
app.use('/api', backendRoutes); // `backendRoutes` is now correctly linked
app.use('/updateprompt', updateprompts)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
