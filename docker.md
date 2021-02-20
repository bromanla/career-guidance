> Требуется: git, docker, docker-compose

1. Клонировать репозиторий
```
    git clone https://github.com/bromanla/career-guidance.git
```

2. Перейти в дирректорию приложения
```
    cd career-guidance
```

3. Заменить \<JWT_SECRET> в docker-compose.yaml на свой ключ шифрования

4. Запустить контейнер
```
    docker-compose build
    docker-compose up -d
```

> id контейнера можно узнать через ```docker ps```

Импорт базы
```
    docker exec -i <mongodb id> sh -c 'mongorestore -d careerguidance --archive' < mongo.dump
```

Экспорт базы
```
    docker exec <mongodb id> sh -c 'mongodump -d careerguidance --archive' > mongo.dump
```