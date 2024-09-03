const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require('./server/routes/userRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URI = 'mongodb://camilo:123456@autorack.proxy.rlwy.net:38433/CineCampus';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});