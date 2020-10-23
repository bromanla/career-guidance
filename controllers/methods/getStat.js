const {Types: {ObjectId}} = require('mongoose');
const {testsMongo} = require('../../mongo');

module.exports = async (id) => {
    const passedBy = ObjectId(id);

    const [statistics  = {}] = await testsMongo.aggregate([
        {$match: {passedBy}},
        {$group: {
            _id: '$passedBy',
            mm: { $sum: "$mm" },
            mn: { $sum: "$mn" },
            mt: { $sum: "$mt" },
            ms: { $sum: "$ms" },
            ma: { $sum: "$ma" },
            max: { $sum: 100}
        }}
    ])

    return statistics
}