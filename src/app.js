const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const File = require('./models/file');  // Import File model




dotenv.config();

const app = express();


app.use(express.json());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..', 'public')));



app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST endpoint to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    const newFile = new File({
        filename: req.file.filename,
        path: req.file.path,  // Save the path to the file in the databas
        mimetype: req.file.mimetype,
        size: req.file.size
    });

    newFile.save()
    .then(() => res.send(`File uploaded successfully: ${req.file.filename}`))

        .catch((err) => res.status(500).send('Error saving file info: ' + err));
});

// GET endpoint to fetch all files
app.get('/api/files', (req, res) => {
    File.find()
        .then(files => res.json(files))
        .catch((err) => res.status(500).send('Error fetching files: ' + err));
});

// GET endpoint to fetch a file by its ID
app.get('/api/files/:id', (req, res) => {
    const fileId = req.params.id;
    File.findById(fileId)
        .then(file => {
            if (!file) {
                return res.status(404).send('File not found');
            }
            res.json(file);
        })
        .catch((err) => res.status(500).send('Error fetching file: ' + err));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});