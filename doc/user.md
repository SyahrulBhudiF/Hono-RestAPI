# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username" : "user",
  "password" : "rahasia",
  "name" : "user name"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "user",
    "name" : "user name"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username must not blank, ..."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username" : "user",
  "password" : "rahasia"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "user",
    "name" : "user name",
    "token" : "token"
  }
}
```

## Get User

Endpoint : GET /api/users/current

Request Header :
- Authorization : token

Response Body (Success) :

```json
{
  "data" : {
    "username" : "user",
    "name" : "user name"
  }
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Header :
- Authorization : token

Request Body :

```json
{
  "name": "Kalo mau update nama",
  "password": "kalo mau update password"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "user",
    "name": "user name"
  }
}
```

## Logout User

Endpoint : DELETE /api/users/current

Request Header :
- Authorization : token

Response Body (Success) :

```json
{
  "data" : true
}
```