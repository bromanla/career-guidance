localhost/login
    POST Content-Type: application/json
    Передаем username, password
    При ошибке возвращается 401 + error message
    При удаче возвращается пара
        refreshToken, jwt


@jwt - токен содержит id пользователя. Время жизни 30 минут. Через него происходит обращение к основным методам.

@refreshtoken - пример (3fe9d9a9-61d9-4825-927a-c169ab89d9fd). Одноразовый токен, с помощью которого получаем новую пару refreshToken, jwt

localhost/refresh
    POST Content-Type: application/json
    Передаем refreshToken
    При ошибке 401
    При удаче возвращается новая пара
        refreshToken, jwt

@info
    refreshToken'ы хранятся в базе данных. Рядом в колонках находится id пользователя, которому он принадлежит и user-agent (для отображения в настройках приложения зайденых устроств)

localhost/method's
    POST, GET, PUT, и т.д
    Передаем JWT в headers authorization bearer
    !Тут необходимые действия. В процессе.
