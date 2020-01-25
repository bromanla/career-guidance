# Career Guidance

> **Внимание!** Описание API находится в режиме разработки.

Json Web Token содержит id пользователя. Время жизни 1 час. Для получения доступа к методам пользователя клиент в заголовке должен отправить Authorization: Bearer \<JWT>.

token - одноразовый токен, с помощью которого получаем новую пару token, jwt или обращаемся к методам logout & logoutOne

---


## **Авторизация пользователя**

```POST /auth/login```

Content-Type: application/json

**Тело запроса:**

Параметр | Описание | Тип      | Варианты
---------|----------|----------|--------------
username | Логин пользователя  | String | [a-zA-Z0-9]
password | Пароль | String     | [a-zA-Z0-9]


**Пример ответа:**
```
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI1ZTI5YWZhMjA4YmUyMTY1YmU2MDA5OTEiLCJpYXQiOjE1Nzk3OTAzMDMsImV4cCI6MTU3OTc5MzkwM30.uYgxSIExPltGaIYZrVTwiusMyO_lODy0kL1rV8A__wY",
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
token    | token    | String   | uuID


**Пример ответа:**
```
Ok
```

## **Получить все тестирования**

```GET /tests```

Authorization: Bearer \<JWT>

**Пример ответа:**
```
{
    "first": 90
    "second": 10
}
```


## **Получить по имени теста**

```GET /tests/{nameTest}```

Authorization: Bearer \<JWT>

**Параметры запроса:**

Параметр | Описание | Тип      | Варианты
---------|----------|----------|--------------
nameTest | Имя теста| String   | [a-zA-Z0-9]

**Пример ответа:**
```
{
    "first": 100
}
```


## **Добавить/Изменить тест**

```PATCH /tests/{nameTest}```

Authorization: Bearer \<JWT>
Content-Type: application/json

**Параметры запроса:**

Параметр | Описание | Тип      | Варианты
---------|----------|----------|--------------
nameTest | Имя теста| String   | [a-zA-Z0-9]

**Тело запроса:**

Параметр | Описание | Тип      | Варианты
---------|----------|----------|--------------
score    | Оценка   | Number   | [0-9]

**Пример ответа:**
```
Ok
```


## **Удалить тест**

```DELETE /tests/{nameTest}```

Authorization: Bearer \<JWT>

**Параметры запроса:**

Параметр | Описание | Тип      | Варианты
---------|----------|----------|--------------
nameTest | Имя теста| String   | [a-zA-Z0-9]


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