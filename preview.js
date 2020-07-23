console.log('Create account');

const {usersMongo, testsMongo, tokensMongo} = require('./mongo');
const bcrypt = require('bcryptjs');

(async () => {
    await usersMongo.deleteMany();
    await testsMongo.deleteMany();
    await tokensMongo.deleteMany();

    const child = await usersMongo({username: 'Roman', password: genHash('one'), role: 0}).save()

    await testsMongo({
        title: 'Created from the console',
        passedBy: child.id,
        mm: 80,
        mn: 80,
        mt: 80,
        ms: 80,
        ma: 80
    }).save()

    await usersMongo({username: 'Parent', password: genHash('one'), role: 1, children: [child.id]}).save()

    for (let i = 1; i <= 30; i++) {
        await usersMongo({username: `Child#${i}`, password: genHash(`password${i}`)}).save()
    }

})()

const genHash = (password) => bcrypt.hashSync(password, 10)
