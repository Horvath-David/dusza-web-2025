```yaml
/api:
    /auth:
        /login:
            method: POST
            description: Log in
            request_body:
                username: string   # The user's login name
                password: string   # The user's password
        
        /logout:
            method: GET
            description: Log out the currently authenticated user
        
        /register:
            method: POST
            description: Register a new user
            request_body:
                username: string        # Unique username for login
                display_name: string    # Publicly visible name
                password: string       # User's chosen password
    
    /world:
        /create:
            method: POST
            description: Create a new world
            request_body:
                name: string            # The world's name
            response:
                status: Ok              # Confirmation of success
                id: number              # The newly created world's ID
        
        /all:
            method: GET
            description: Get all public worlds
            response:
                worlds:
                    -   id: number          # World ID
                        name: string        # World name
                        owner: string       # Owner's display name
                        is_playable: bool   # True if world can be played (potentially unused)
                        dungeons: number    # Number of dungeons in the world
                        cards: number       # Number of cards in the world
                        player_cards:
                            -   id: number
                                name: string
                                hp: number
                                attack: number
                                type: fire|earth|water|air
        
        /my:
            method: GET
            description: Get all worlds created by the authenticated user
            response:  Same schema as /all
            
        /<world_id>:
            method: GET
            description: Request a world's data using its ID
            response:
                world:
                    id: number
                    name: string
                    owner: string
                    is_playable: bool
                    is_public: bool
                    dungeons: number        # The number of dungeons in this world
                    cards: number           # The number of cards in this world
                    player_cards: Same schema as /all player_cards

        /<world_id>/update:
            method: PATCH
            description: Modify a world's properties, Only the included fields will be modified
            body:
                name: string
                is_playable: bool
                is_public: bool
                player_cards: [ number ]    # A list of IDs for player cards
            returns:
                message: An error if the player cards were ignored because of a duplicate. General success message if no duplicates were found
                
        /<world_id>/delete:
            method: DELETE
            description: Delete a world.

        /<world_id>/cards:
            method: GET
            description: Get all cards associated with a world
            response:
                cards:
                    -   id: number
                        name: string
                        hp: number
                        attack: number
                        type: fire|earth|water|air
                        is_boss: boolean
        
        /<world_id>/dungeons:
            method: GET
            description: Get all dungeons associated with a world
            response:
                dungeons:
                    -   id: number
                        name: string
                        type: basic|small|big
                        cards:
                            -   id: number
                                name: string
                                hp: number
                                attack: number
                                type: fire|earth|water|air
    
    /card:
        /<card_id>:
            method: GET
            description: Get a card based on ID
            response:
                card:
                    id: number
                    name: string
                    hp: number
                    attack: number
                    type: fire|earth|water|air
                    
        /create:
            method: POST
            description: Add new cards to a world
            request_body:
                world_id: number   # Target world ID
                cards:
                    -   name: string
                        hp: number
                        attack: number
                        type: fire|earth|water|air
                        is_boss: bool
            response:
                skipped: # Cards that were not created
                    -   name: string          # Skipped card's name
                        reason: string        # Reason for skipping
                ids: [ number] # A list of newly created cards' IDs
        
        /<card_id>/update:
            method: PATCH
            description: Update a card's fields (all optional)
            request_body:
                name: string
                hp: number
                attack: number
                type: fire|earth|water|air
                is_boss: boolean
        
        /<card_id>/delete:
            method: DELETE
            description: Delete a card by ID
    
    /dungeon:
        /create:
            method: POST
            description: Create a dungeon, assign it to a world, and assign cards to it
            request_body:
                name: string              # Dungeon name
                cards: [ number ]         # List of card IDs to assign
                type: basic|small|big     # Dungeon size/type
                world_id: number          # Associated world ID
            response:
                status: Ok
                id: number                # Newly created dungeon's ID
        
        /<dungeon_id>/update:
            method: POST
            description: Update an existing dungeon (all fields optional)
            request_body:
                name: string
                cards: [ number ]         # List of card IDs to assign
                type: basic|small|big

        /<dungeon_id>/delete:
            method: DELETE
            description: delete a dungeon
        
        get/<dungeon_id>:
            method: GET
            description: Get a dungeon and its cards by ID
            response:
                dungeon:
                    id: number
                    name: string
                    type: basic|small|big
                    cards:
                        -   id: number
                            name: string
                            hp: number
                            attack: number
                            type: fire|earth|water|air
    
    /state:
        /my: 
            method: GET
            description: Get all game states owned by the authenticated user
            response:
                game_state:
                    -   id: number
                        owner: string
                        world:
                            id: number
                            name: string
                            owner: string
                        state: json
                        created_at: ISO timestamp
                        last_updated_at: ISO timestamp
        /save:
            method: PUT
            description: Upload a game state to be saved for later use
            request_body:
                id: number                # Optional; object gets overwritten if exists
                world_id: number          # World associated with this save
                state: json               # The actual game state
            response:
                id: number                # Returned only if a new object was created
                world_name: string        # The world's name associated with this save
        
        /<state_id>/get:
            method: GET
            description: Request a saved game state
            response:
                id: number
                owner: string
                world:
                    id: number
                    name: string
                    owner: string
                state: json
                created_at: ISO timestamp
                last_updated_at: ISO timestamp

```