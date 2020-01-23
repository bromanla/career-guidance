const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/careerguidance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    promiseLibrary: true
})

mongoose.connection.on('error', (err) => {
    console.error("Database Connection Error: " + err);
    process.exit(2);
});

mongoose.connection.on('connected', () => {
    console.info("Succesfully connected to Mongo");
});

module.exports = mongoose;
