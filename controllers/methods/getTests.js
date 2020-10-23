const {testsMongo} = require('../../mongo');
const perPage = 25;

module.exports = async (passedBy, page) => {
    const currentPage = /^[1-9][0-9]*$/.test(page) ? +page : 1;

    // Count tests
    const totalEntries = await testsMongo.find({passedBy}).countDocuments();
    const totalPages = Math.ceil(totalEntries / perPage);

    let tests;

    // If there are no entries on the page
    if (totalPages < page)
        tests = []
    else
        tests = await testsMongo.find({passedBy}, {passedBy: false}).sort({_id: -1}).skip(perPage * (currentPage - 1)).limit(perPage).lean();

    return {
        tests,
        pagination: {
            totalPages,
            currentPage,
            totalEntries,
            perPage,
            currentEntries: tests.length,
        }
    }
}