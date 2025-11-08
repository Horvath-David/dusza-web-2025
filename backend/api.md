All starts with `/api`

`/auth/`

&nbsp;&nbsp;&nbsp;&nbsp;`/login` POST

&nbsp;&nbsp;&nbsp;&nbsp;Log in

```json
{
    "username": "string",
    "password": "string"
}
```

---

&nbsp;&nbsp;&nbsp;&nbsp;`/logout` GET

&nbsp;&nbsp;&nbsp;&nbsp;Log out

---

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

---

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

---

&nbsp;&nbsp;&nbsp;&nbsp;`/<world_id>/cards` GET

&nbsp;&nbsp;&nbsp;&nbsp;Returns all cards associated with a world

&nbsp;&nbsp;&nbsp;&nbsp;On success returns:

```json
{
    "cards": [
        {
            "id": "number",
            "name": "string",
            "hp": "number",
            "attack": "number",
            "type": "fire|earth|water|air",
            "is_boss": "boolean"
        }
    ]
}
```

---

&nbsp;&nbsp;&nbsp;&nbsp;`/<world_id>/dungeons` GET

&nbsp;&nbsp;&nbsp;&nbsp;Returns all cards associated with a world

&nbsp;&nbsp;&nbsp;&nbsp;On success returns:

```json
{
    "dungeons": [{
        "id": "number",
        "name": "string",
        "type": "basic|small|big",
        "cards": [{
            "id": "number",
            "name": "string",
            "hp": "number",
            "attack": "number",
            "type": "fire|earth|water|air"
        }]
    }]
}
```

---

---

`/card`

&nbsp;&nbsp;&nbsp;&nbsp;`/create/` POST

&nbsp;&nbsp;&nbsp;&nbsp;Add new cards to a world

```json
{
    "world_id": "string/number",
    "cards": [
        {
            "name": "string",
            "hp": "number",
            "attack": "number",
            "type": "fire|earth|water|air"
        }
    ]
}
```

&nbsp;&nbsp;&nbsp;&nbsp;On success returns:

```json
{
    "skipped": [
        {
            "name": "string", // The skipped card's name
            "reason": "string" //The reason for skipping the card
        }
    ]
}
```

---

&nbsp;&nbsp;&nbsp;&nbsp;`/<card_id>/update` PATCH

&nbsp;&nbsp;&nbsp;&nbsp;Update a card's fields

&nbsp;&nbsp;&nbsp;&nbsp;All fields are optional

```json
{
    "name": "string",
    "hp": "number",
    "attack": "number",
    "type": "fire|earth|water|air",
    "is_boss": "boolean"
}
```

---

&nbsp;&nbsp;&nbsp;&nbsp;`/<card_id>/delete` Delete

&nbsp;&nbsp;&nbsp;&nbsp;Delete a card

---

---

`/dungeon`

&nbsp;&nbsp;&nbsp;&nbsp;`/create` POST

&nbsp;&nbsp;&nbsp;&nbsp;Create a dungeon, assign it to a world and assign cards to it

```json
{
    "name": "string",
    "cards": "number[]", // a list of cards' ids to be assigned to this dungeon
    "type": "basic|small|big",
    "world_id": "number"
}
```

&nbsp;&nbsp;&nbsp;&nbsp;On success returns:

```json
{
    "status": "Ok",
    "id": "number" // the id of the newly created dungeon
}
```

---

&nbsp;&nbsp;&nbsp;&nbsp;`/<dungeon_id>/update` POST

&nbsp;&nbsp;&nbsp;&nbsp;Create a dungeon, assign it to a world and assign cards to it

&nbsp;&nbsp;&nbsp;&nbsp;All fields are optional

```json
{
    "name": "string",
    "cards": "number[]", // a list of cards' ids to be assigned to this dungeon
    "type": "basic|small|big"
}
```
