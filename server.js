const express = require('express');
const inputCheck = require('./utils/inputCheck');

const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRoutes);

// API ROUTES (endpoints)

// TEST CONNECTION
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World'
//     });
// });

// Default response for any reuqests that are Not Found
app.use((req, res) => {
    res.status(404).end();
});

//listen for port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});