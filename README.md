# example-gridfs-express

This an example to show how to use the package [gridfs-express](https://gitlab.com/jorge.suit/gridfs-express)

## Running the service

First you need to install the runtime dependencies:

```
npm install
```

then start the service:

```
PORT=3002 npm start
```

## Examples of API call

The following examples use the client [httpie](https://github.com/jakubroztocil/httpie)

### Try to list files when metadata key is not provided: `GET /api/gridfs/v2`

#### Request
```
http -v GET 'localhost:3002/api/gridfs/v2'
```
```
GET /api/gridfs/v2 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:3000
User-Agent: HTTPie/0.9.2
```

#### Response

The response for this error situation contains the array of missing url query parameters.

```
HTTP/1.1 400 Bad Request
Connection: keep-alive
Content-Length: 105
Content-Type: application/json; charset=utf-8
Date: Tue, 20 Mar 2018 08:54:12 GMT
ETag: W/"69-WvKplPZwC94lvhq+puiYHmLyrw4"
X-Powered-By: Express

{
    "data": {
        "parameters": [
            "name", 
            "family", 
            "ref"
        ]
    }, 
    "error": "Bad Request", 
    "message": "required query parameter", 
    "statusCode": 400
}
```

### List files with a complete key vector (name, family, ref): `GET /api/gridfs/v2`

For a given vector key we can store multiples files with different names.

#### Request

```
http -v GET 'localhost:3002/api/gridfs/v2?name=tork&family=gree&ref=kerp'
```
```
GET /api/gridfs/v2?name=andtork&family=gree&ref=kerp HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:3002
User-Agent: HTTPie/0.9.2
```

#### Response

The response is an empty array because there is no file for the key `(name=andtork, family=green, ref=kerp)`

```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 2
Content-Type: application/json; charset=utf-8
Date: Tue, 20 Mar 2018 09:53:06 GMT
ETag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
X-Powered-By: Express

[]
```

### Upload a file: `POST /api/gridfs/v2`

#### Request

```
http -v --form POST 'localhost:3002/api/gridfs/v2?name=andtork&family=gree&ref=kerp' file@sample_A.txt 
```
```
POST /api/gridfs/v2?name=andtork&family=gree&ref=kerp HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 158
Content-Type: multipart/form-data; boundary=7655fe64465e4a59b85d5c958c357f8c
Host: localhost:3002
User-Agent: HTTPie/0.9.2

--7655fe64465e4a59b85d5c958c357f8c
Content-Disposition: form-data; name="file"; filename="sample_A.txt"

muestra A

--7655fe64465e4a59b85d5c958c357f8c--
```

#### Response

```
HTTP/1.1 201 Created
Connection: keep-alive
Content-Length: 60
Content-Type: application/json; charset=utf-8
Date: Tue, 20 Mar 2018 10:00:05 GMT
ETag: W/"3c-9qSRGgmKPe50lySmRjkTsxZInuM"
X-Powered-By: Express

{
    "_id": "5ab0dba599a44c4a66ed74df", 
    "filename": "sample_A.txt"
}
```

### List the files: `GET /api/gridfs/v2`

#### Request

```
http -v GET 'localhost:3002/api/gridfs/v2?name=andtork&family=gree&ref=kerp'
```
```
GET /api/gridfs/v2?name=andtork&family=gree&ref=kerp HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:3002
User-Agent: HTTPie/0.9.2
```

#### Response

The response contains and array with information about each file stored for the given key.

```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 233
Content-Type: application/json; charset=utf-8
Date: Tue, 20 Mar 2018 10:03:12 GMT
ETag: W/"e9-oQaTnxCi879p5o+eYhseG88O7dA"
X-Powered-By: Express

[
    {
        "_id": "5ab0dba599a44c4a66ed74df", 
        "chunkSize": 261120, 
        "filename": "sample_A.txt", 
        "length": 10, 
        "md5": "d8f0e115e9ef0e004483364db6d82763", 
        "metadata": {
            "family": "gree", 
            "name": "andtork", 
            "ref": "kerp"
        }, 
        "uploadDate": "2018-03-20T10:00:05.528Z"
    }
]
```

### Modify the metadata: `PATCH /api/gridfs/v2/:file_id/metadata`

Besides the key stored in the metadata field we can include more properties.
The parameter `:file_id` can be provided either as and `id` or as a `filename`.
The meaning of the parameter `:file_id` depends on the value of the query parameter `key`:
* `key=id` => `:file_id` should be an internal identifier, see the value of the property `_id` returned in `POST` or `GET`
* `key=filename` => `:file_id` should be the name of the file

The query parameter `key` is optional and if not provided it defaults to `id`.

#### Request
```
http -v PATCH 'localhost:3002/api/gridfs/v2/sample_A.txt/metadata?name=andtork&family=gree&ref=kerp&key=filename' description='This is a nice and very old object' age:=150000
```
```
PATCH /api/gridfs/v2/sample_A.txt/metadata?name=andtork&family=gree&ref=kerp&key=filename HTTP/1.1
Accept: application/json
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 68
Content-Type: application/json
Host: localhost:3002
User-Agent: HTTPie/0.9.2

{
    "age": 150000, 
    "description": "This is a nice and very old object"
}
```

#### Response
```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 73
Content-Type: application/json; charset=utf-8
Date: Tue, 20 Mar 2018 10:24:10 GMT
ETag: W/"49-qpkTh3A2auh1bUj5qh9Yk905QaU"
X-Powered-By: Express

{
    "key": {
        "filename": "sample_A.txt"
    }, 
    "update": {
        "n": 1, 
        "nModified": 1, 
        "ok": 1
    }
}
```

### Retrieve metadata: `GET /api/gridfs/v2/:file_id/info`

#### Request
```
http -v GET 'localhost:3002/api/gridfs/v2/sample_A.txt/info?name=andtork&family=gree&ref=kerp&key=filename'
```
```
GET /api/gridfs/v2/sample_A.txt?name=andtork&family=gree&ref=kerp&type=info&key=filename HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:3002
User-Agent: HTTPie/0.9.2
```

#### Response
```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 295
Content-Type: application/json; charset=utf-8
Date: Tue, 20 Mar 2018 10:27:05 GMT
ETag: W/"127-f9jLjp7qCfkKx98OIjYQ+tJGgeA"
X-Powered-By: Express

{
    "_id": "5ab0dba599a44c4a66ed74df", 
    "chunkSize": 261120, 
    "filename": "sample_A.txt", 
    "length": 10, 
    "md5": "d8f0e115e9ef0e004483364db6d82763", 
    "metadata": {
        "age": 150000, 
        "description": "This is a nice and very old object", 
        "family": "gree", 
        "name": "andtork", 
        "ref": "kerp"
    }, 
    "uploadDate": "2018-03-20T10:00:05.528Z"
}
```

### Delete a file: `DELETE /api/gridfs/v2/:file_id`

#### Request
```
http -v DELETE 'localhost:3002/api/gridfs/v2/sample_A.txt?name=andtork&family=gree&ref=kerp&key=filename'
```
```
DELETE /api/gridfs/v2/sample_A.txt?name=andtork&family=gree&ref=kerp&key=filename HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 0
Host: localhost:3002
User-Agent: HTTPie/0.9.2
```

#### Response
```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 27
Content-Type: application/json; charset=utf-8
Date: Tue, 20 Mar 2018 10:29:16 GMT
ETag: W/"1b-OxAwoNVwSrrmPb7+0juzHHEHTbM"
X-Powered-By: Express

{
    "filename": "sample_A.txt"
}
```