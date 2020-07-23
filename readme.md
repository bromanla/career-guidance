# Career Guidance

> **Внимание!** Описание API находится в режиме разработки.

## **JWT (Access)**
Json Web Token содержит полезную нагрузку пользователя (payload). Время жизни 1 час. Предоставляет доступ к методам. Передается в заголовках: ```Authorization: Bearer <JWT>```

## **Token (Refresh)**
Токен, позволящий получать новый Access токен по источению его времени жизни. Время жизни 90 дней.

## **Доступ к методам**
Каждой учетной записи присваивается роль. Payload JWT отличается в зависимости от уровня.

**Обозначение ролей:**

Параметр    | Описание | Заметка
------------|----------|---------
0           | Student  |
1           | Parent   |
2           | Teacher  | В разрабокте
3           | Admin    | В разработке

## **Payload JWT**

**For Student**
Параметр    | Тип      | Описание
------------|----------|---------
role        | Number   | Роль
classroom   | Number   | Класс

**For Parent**
Параметр    | Тип      | Описание
------------|----------|---------
role        | Number   | Роль
children    | Array    | Массив объектов. Содержит id & username привязанных детей

**For Teacher**
Параметр    | Тип      | Описание
------------|----------|---------
role        | Number   | Роль
classrooms  | Array    | Массив классов (In developing)


---


## **Авторизация**

```POST /auth/login```

Content-Type: application/json

**Тело запроса:**

Параметр | Описание | Тип    | Варианты
---------|----------|--------|--------------
username | Логин    | String | [a-zA-Z0-9]
password | Пароль   | String | [a-zA-Z0-9]


**Пример ответа:**
```json
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI1ZjE5YzYwOGRkNTMzYTI2YzhlZDFlNzQiLCJyb2xlIjowLCJpYXQiOjE1OTU1MjQ4NjgsImV4cCI6MTU5NTUzNTY2OH0.XoevaCAGfnNee5sg3-Uv1mJ7ZfPa3YzOYPgro15nqIY",
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
Ответ идентичен авторизации
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
OK
```

> Для всех последующих методов необходимо передавать в заголовке `Authorization: Bearer <JWT>`


## **Список авторизованных устройств**

```GET /agent```

**Пример ответа:**
```json
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

**Пример ответа:**
```json
[
    {
        "_id": "5f19bfdf883f6514d4011983",
        "title": "Created from the console",
        "mm": 80,
        "mn": 80,
        "mt": 80,
        "ms": 80,
        "ma": 80
    }
]
```

## **Добавить тестирование**

```POST /s/tests/```

**Тело запроса:**

Параметр | Описание                     | Тип      | Варианты
---------|------------------------------|----------|----------
title    | Название теста               | String   | [(a-z)(0-9)(а-яё)\s]
mm       | Человек человек              | Number   | [0-100]
mn       | Человек природа              | Number   | [0-100]
mt       | Человек техника              | Number   | [0-100]
ms       | Человек знаковая             | Number   | [0-100]
ma       | Человек художественный образ | Number   | [0-100]

**Пример ответа:**
```
ok
```

## **Изменить тестирование**

```PUT /s/tests/{_id}```

```
Параметры запроса и ответы идентичены добавлению
```

---

# **Только для Parent**
## **Получить результаты тестирований ребенка**
```GET /p/tests/{childId}```

childId хранится в payload JWT (спорно, но пока так)

**Пример ответа:**
```json
[
    {
        "_id": "5f19bfdf883f6514d4011985",
        "title": "Children test",
        "mm": 80,
        "mn": 80,
        "mt": 80,
        "ms": 80,
        "ma": 80
    }
]
```