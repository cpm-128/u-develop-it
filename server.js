const express = require('express');
const PORT = process.env.PORT || 3001;

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// GET routes


// Default response for any reuqests that are Not Found
app.use((req, res) => {
    res.status(404).end();
});

//listen for port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});