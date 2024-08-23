// transcription.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const { transcribeAudio, getChatCompletion } = require('../utils/audio');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

let transcriptions = [];

router.post('/asr', upload.single('wavfile'), async (req, res) => {
  console.log('File received:', req.file);
  const { label, contactId, dateTime } = req.body;

  try {
    if (!req.file) throw new Error('No file uploaded');

    const transcript = await transcribeAudio(req.file.path);
    console.log('Transcription:', transcript);

    const chatResponse = await getChatCompletion(label, transcript, Text);
    console.log('Claude Sonnet Response:', chatResponse);


    const recordingUrl = `http://localhost:8080/uploads/${req.file.filename}`;
    console.log('Recording URL:', recordingUrl);

    const transcription = {
      id: Date.now(),
      transcript,
      filePath: req.file.filename,
      contactId,
      dateTime,
      recordingUrl,
    };

    transcriptions.push(transcription);

    res.status(200).json({
      message: 'File received, transcribed, and responded successfully',
      transcript,
      chatResponse,
      recordingUrl,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


router.get('/transcriptions', (req, res) => {
  res.json({ contacts: transcriptions });
});


app.use('/apii', router);

module.exports = router;


