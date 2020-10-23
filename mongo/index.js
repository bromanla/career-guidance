const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb://localhost:27017/careerguidance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    promiseLibrary: true,
    useFindAndModify: false
})

mongoose.connection.on('connected', () => {
    console.info("Succesfully connected to Mongo");
});

mongoose.connection.on('error', (err) => {
    console.error("Database Connection Error: " + err);
    process.exit(2);
});

module.exports = {
    ...require('./schemas/tests'),
    ...require('./schemas/tokens'),
    ...require('./schemas/users'),
    ...require('./schemas/classes')
}