# Career Guidance

> **Внимание!** Описание API находится в режиме разработки.

## **JWT**
Json Web Token содержит полезную нагрузку пользователя (payload). Время жизни 1 час. Для получения доступа к методам, клиент должен отправить в заголовке: ```Authorization: Bearer <JWT>```

**Обозначение ролей:**

Параметр    | Описание | Заметка
------------|----------|---------
0           | Student  |
1           | Parent   |
2           | Teacher  | В разрабокте
3           | Admin    | В разработке

**Student**
Параметр    | Тип      | Описание
------------|----------|---------
role        | Number   | Роль
classroom   | Number   | Класс

**Parent**
Параметр    | Тип      | Описание
------------|----------|---------
role        | Number   | Роль
children    | Array    | Массив имен детей

**Teacher**
Параметр    | Тип      | Описание
------------|----------|---------
role        | Number   | Роль
classrooms  | Array    | Массив классов

## **Token**
Одноразовый токен для получения новых ключей или обращения к некоторым методам

---


## **Авторизация пользователя**

```POST /auth/login```

Content-Type: application/json

**Тело запроса:**

Параметр | Описание           | Тип    | Варианты
---------|--------------------|--------|--------------
username | Логин пользователя | String | [a-zA-Z0-9]
password | Пароль             | String | [a-zA-Z0-9]


**Пример ответа:**
```
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI1ZTVmM2UwZDdlMzZkZjA4MzQ2YTYwNDgiLCJyb2xlIjoxLCJjaGlsZHJlbiI6WyJSb21hbiJdLCJpYXQiOjE1ODQ4NzUwMjAsImV4cCI6MTU4NDg3ODYyMH0.4Ixo893mcFeq-5w6oOh8_o0HF41X1xKH-rD0q3ZTT7U",
    "token": "7cb5a0d8-9ded-4a94-8b57-8217c6fe5fc0"
}
```

## **Получение новой пары токенов**

```POST /auth/refresh```

Content-Type: application/json

**Тело запроса:**

Параметр | Описание | Тип      | Варианты
---------|----------|----------|--------------
token    | token    | String   | uuID


Пример ответа:
```
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI1ZTI5YWZhMjA4YmUyMTY1YmU2MDA5OTEiLCJpYXQiOjE1Nzk3OTAzMDMsImV4cCI6MTU3OTc5MzkwM30.uYgxSIExPltGaIYZrVTwiusMyO_lODy0kL1rV8A__wY",
    "token": "7cb5a0d8-9ded-4a94-8b57-8217c6fe5fc0"
}
```


## **Выход из системы**

```POST /auth/logout & /auth/logoutOne```

Content-Type: application/json

**Тело запроса:**

Параметр | Описание | Тип      | Варианты
---------|----------|----------|--------------
token    | token    | String   | uuid(4)


**Пример ответа:**
```
Ok
```


## **Список авторизованных устройств**

```GET /agent```

Authorization: Bearer \<JWT>\

**Пример ответа:**
```
[
    {
        "_id": "5e29afdf9bd9910f9a793ebd",
        "agent": "PostmanRuntime/7.22.0"
    },
    {
        "_id": "5e29c1489bd9910f9a793ebe",
        "agent": "vscode-restclient"
    }
]
```

---
# **Только для Student**
## **Получить все тестирования**

```GET /s/tests```

Authorization: Bearer \<JWT>

**Пример ответа:**
```
{
    "First": {
        "mm": 30,
        "mn": 10,
        "mt": 20,
        "ms": 10,
        "ma": 30
    },
    "Second": {
        "mm": 2,
        "mn": 2,
        "mt": 2,
        "ms": 2,
        "ma": 10
    }
}
```


## **Изменить/Добавить тестирование**

```PATCH /s/tests```

Authorization: Bearer \<JWT>

**Тело запроса:**

Параметр | Описание                     | Тип      | Варианты
---------|------------------------------|----------|----------
mm       | Человек человек              | Number   | [0-100]
mn       | Человек природа              | Number   | [0-100]
mt       | Человек техника              | Number   | [0-100]
ms       | Человек знаковая             | Number   | [0-100]
ma       | Человек художественный образ | Number   | [0-100]

**Пример ответа:**
```
ok
```

---
# **Только для Parent**
## **Получить все доступные тестирования**
```GET /p/tests/{username}```

Authorization: Bearer \<JWT>

username хранится в payload

**Пример ответа:**
```
{
    "First": {
        "mm": 30,
        "mn": 10,
        "mt": 20,
        "ms": 10,
        "ma": 30
    },
    "Second": {
        "mm": 2,
        "mn": 2,
        "mt": 2,
        "ms": 2,
        "ma": 10
    }
}
```


---
# **Только для Teacher**
## **Получить информацию о доступных учащихся**
```GET /t/students```

Authorization: Bearer \<JWT>

**Пример ответа:**
```
[
    {
        "username": "Roman",
        "classroom": 2
    },
    {
        "username": "Vova",
        "classroom": 1
    }
]
```


## **Изменить/Добавить тестирование учащемуся**

```PATCH /t/tests/{username}/{nametest}```

Authorization: Bearer \<JWT>

**Тело запроса:**

Параметр | Описание                     | Тип      | Варианты
---------|------------------------------|----------|----------
mm       | Человек человек              | Number   | [0-100]
mn       | Человек природа              | Number   | [0-100]
mt       | Человек техника              | Number   | [0-100]
ms       | Человек знаковая             | Number   | [0-100]
ma       | Человек художественный образ | Number   | [0-100]

**Пример ответа:**
```
ok
```


## **Удалить тестирование**

```DELETE /t/tests/{username}/{nametest}```

Authorization: Bearer \<JWT>

**Пример ответа:**
```
ok
```