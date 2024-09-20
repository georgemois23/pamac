const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let mongoServer;

const startDatabase = async () => {
  try {
    if (process.env.NODE_ENV === 'test') {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
      // Connect to your production database here
      await mongoose.connect('mongodb://localhost/anonymous-chat', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

startDatabase();

const messageSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

app.post('/messages', async (req, res) => {
  try {
    const newMessage = new Message({ content: req.body.content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error saving message' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export app for testing purposes
