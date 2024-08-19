# Auth API Spec

### Register

Endpoint : `POST /api/register`

Request Body :

```json
{
  "email": "example@email.com",
  "username": "example name",
  "password": "secret"
}
```

Response Body (Success) :

```json
{
  "data": {
    "email": "example@email.com",
    "username": "example name"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Field must not to be empty, ..."
}
```

### Login

Endpoint : `POST /api/login`

Request Body :

```json
{
  "email": "example@email.com",
  "password": "secret"
}
```

Response Body (Success) :

```json
{
  "message": "Successfully Login",
  "data": {
    "email": "example@email.com",
    "username": "example name"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Invalid credentials"
}
```

### Google Login

Endpoint : `POST /api/oauht/google`

Request Headers :
`Authorization: Bearer <access_token>`

Response Body (Success) :

```json
{
  "message": "Successfully login",
  "data": {
    "email": "example@email.com",
    "username": "example name"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Invalid credentials"
}
```

### Facebook Login

Endpoint : `POST /api/oauth/fb`

Request Headers :
`Authorization: Bearer <access_token>`

Response Body (Success) :

```json
{
  "message": "Successfully login",
  "data": {
    "email": "example@email.com",
    "username": "example name"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Invalid credentials"
}
```
