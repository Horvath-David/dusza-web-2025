`/auth/`

&nbsp;&nbsp;&nbsp;&nbsp;`/login` POST

&nbsp;&nbsp;&nbsp;&nbsp;Log in

```json
{
    "username": "string",
    "password": "string"
}
```

&nbsp;&nbsp;&nbsp;&nbsp;`/logout` GET

&nbsp;&nbsp;&nbsp;&nbsp;Log out


&nbsp;&nbsp;&nbsp;&nbsp;`/register` POST

&nbsp;&nbsp;&nbsp;&nbsp;Register a new user

```json
{
    "username": "string",
    "display_name": "string",
    "passwords": "string"
}
```
---

`/world`

&nbsp;&nbsp;&nbsp;&nbsp;`/create` POST

```json
{
    "name": "string"
}
```

&nbsp;&nbsp;&nbsp;&nbsp;On success returns:
```json
{
    "status": "Ok",
    "id": "[number]" // the newly created world's id
}
```

&nbsp;&nbsp;&nbsp;&nbsp;`/all` GET

&nbsp;&nbsp;&nbsp;&nbsp;Get all public worlds

&nbsp;&nbsp;&nbsp;&nbsp;On success returns:

```json
[
    {
        "id": "number",
        "name": "string",
        "owner": "string", // the owner's display name
        "is_playable": "bool" // true if the world can be played (potentially unused)
    }
]
```

&nbsp;&nbsp;&nbsp;&nbsp;`/my` GET

&nbsp;&nbsp;&nbsp;&nbsp;Get all worlds created by the authenticated user

&nbsp;&nbsp;&nbsp;&nbsp;On success returns: same schema as in `/all`


