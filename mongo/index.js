const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

mongoose.connect(`mongodb://${process.env.MONGO_URL || 'localhost'}:27017/careerguidance`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    promiseLibrary: true,
    useFindAndModify: false
})

mongoose.connection.on('connected', () => {
    console.log('Succesfully connected to Mongo');
});

mongoose.connection.on('error', (err) => {
    console.log('Database Connection Error: ' + err);
    process.exit(1);
});

module.exports = {
    ...require('./schemas/tests'),
    ...require('./schemas/tokens'),
    ...require('./schemas/users'),
    ...require('./schemas/classes')
}