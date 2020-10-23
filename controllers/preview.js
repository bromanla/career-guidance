console.log('Create account');

const { usersMongo, testsMongo, tokensMongo, classesMongo } = require('../mongo');
const bcrypt = require('bcryptjs');

const randResult = (max = 100, min = 0) => Math.round(min - 0.5 + Math.random() * (max - min + 1));

(async () => {
    await usersMongo.deleteMany();
    await testsMongo.deleteMany();
    await tokensMongo.deleteMany();
    await classesMongo.deleteMany();

    const Roman = await usersMongo({username: 'Roman', password: genHash('one'), birthday: 2000}).save();
    const Vova = await usersMongo({username: 'Vova', password: genHash('one'), birthday: 2004}).save();
    const teacher = await usersMongo({username: 'Teacher', password: genHash('one'), role: 2}).save();

    await classesMongo({classroom: '1', students: [Roman.id], teachers: [teacher.id]}).save();
    await classesMongo({classroom: '2', students: [Vova.id], teachers: [teacher.id]}).save();

    for (let i = 1; i <= 5; i++) {
        await testsMongo({
            title: 'Created from the console#' + i,
            passedBy: Roman.id,
            mm: randResult(),
            mn: randResult(),
            mt: randResult(),
            ms: randResult(),
            ma: randResult()
        }).save()
    }

    for (let i = 1; i <= 10; i++) {
        const child = await usersMongo({username: `Child#${i}`, password: genHash(`password${i}`), birthday: randResult(2013, 2002)}).save()

        if (Math.random() >= 0.5)
            await classesMongo.updateOne({classroom: '1'}, {$push: {students: child.id}})
        else
            await classesMongo.updateOne({classroom: '2'}, {$push: {students: child.id}})
    }
})()

const genHash = (password) => bcrypt.hashSync(password, 10)
