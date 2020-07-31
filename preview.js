console.log('Create account');

const {usersMongo, testsMongo, tokensMongo} = require('./mongo');
const bcrypt = require('bcryptjs');

const randResult = (max = 100, min = 0) => Math.round(min - 0.5 + Math.random() * (max - min + 1));

(async () => {
    await usersMongo.deleteMany();
    await testsMongo.deleteMany();
    await tokensMongo.deleteMany();

    const child = await usersMongo({username: 'Roman', password: genHash('one'), role: 0}).save()

    for (let i = 1; i <= 30; i++) {
        await testsMongo({
            title: 'Created from the console#' + i,
            passedBy: child.id,
            mm: randResult(),
            mn: randResult(),
            mt: randResult(),
            ms: randResult(),
            ma: randResult()
        }).save()
    }

    await usersMongo({username: 'Parent', password: genHash('one'), role: 1, children: [child.id]}).save()

    for (let i = 1; i <= 30; i++) {
        await usersMongo({username: `Child#${i}`, password: genHash(`password${i}`)}).save()
    }

})()

const genHash = (password) => bcrypt.hashSync(password, 10)
