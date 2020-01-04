'use strict';

require('dotenv').config()
const express = require('express');
const app = express()
const jwt = require('jsonwebtoken')
const mysql = require('mysql2/promise');
const uuid = require('uuid/v4');
var jwtMiddleware = require('express-jwt');

console.clear()

const pool = mysql.createPool({
    host: 'localhost',
    user: 'mysql',
    password: 'mysql',
    database: 'chsu'
});

const unlessJWT = ['/login', '/refresh'];

/* Middleware */
app.use(express.json());
app.use(jwtMiddleware({secret: process.env.secret}).unless({path: unlessJWT}));

// Обработка ошибок JWT
app.use((err, req, res, next) => {
    if (err)
        return res.status(err.status).send(err.message);

    next();
});

// Подписать новые токены
async function issueToken(id, agent) {
    // Генерируем новый токен
    const newRefreshToken = uuid();

    await pool.query(`insert into refreshtokens (userId, token, agent) values (${id}, '${newRefreshToken}', '${agent}')`);

    return {
        token: jwt.sign({id}, process.env.secret, {expiresIn: '15m'}),
        refreshToken: newRefreshToken
    }
}

// Авторизация пользователя в системе
app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    const [[user]] = await pool.query(`select * from users where username = '${username}'`);

    if (!user)
        return res.status(401).send('Incorrect username');

    if (user.password != password)
        return res.status(401).send('Incorrect password');

    const agent = req.headers['user-agent'];

    res.send(await issueToken(user.id, agent))
});

// Перевыпуск токенов
app.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    const [[token]] = await pool.query(`select id, userId from refreshtokens where token = '${refreshToken}'`);

    if (!token)
        return res.status(401).send('Invalid token');

    // Удалить старый refresh token
    await pool.query(`delete from refreshtokens where token = '${refreshToken}'`);

    const agent = req.headers['user-agent'];

    res.send(await issueToken(token.userId, agent))
})

// Выход со всех устройств
app.post('/logout', async (req, res) => {
    await pool.query(`delete from refreshtokens where userId = ${req.user.id}`);
    res.json(req.user);
})

// Результаты тестирования
app.get('/tests/:name', async (req, res) => {
    const nameTest = req.params.name;

    let [[{tests}]] = await pool.query(`select tests from users where id = ${req.user.id}`);

    if (!tests)
        return res.json({})

    res.json(nameTest === '*' ? tests : {[nameTest]: tests[nameTest]})
})


// Добавление или обновление тестов
app.put('/tests/', async (req, res) => {
    let [[{tests}]] = await pool.query(`select * from users where id = ${req.user.id}`);

    const {name, result} = req.body.result;

    tests[name] = result;

    await pool.query(`update users set tests = '${JSON.stringify(tests)}' where id = ${req.user.id}`);

    res.status(201).send('Ok');
})

app.get('/agent', async (req, res) => {
    let [agent] = await pool.query(`select id, agent from refreshtokens where userId = ${req.user.id}`);

    // Конвертируем в более удобный вид
    const agentConvert = {}
    agent.forEach(el => agentConvert[el.id] = el.agent);

    res.json(agentConvert)
})

app.listen(4000);

/**
* TO DO
*
* - Валидация входных данных
* - Обработка ошибок от БД
* - Раскидать все по разным файлам
* - Перевести на monogoDB
*
**/