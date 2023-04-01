_A 2-player turn based game where each player has a fleet of warships & a 10x10 board where the ships are placed. Players cannot see opponent's ships placement. Each round player takes turn & attack on opponent's grid with the hopes of hitting their ship. Game is won when an opponent loses all of their ships._

### Non-Technical Breakdown

We can deduce that the game consist of the following components:
- Players
- Warships
- Board

Now, we can figure out the role of each of these components separately:

##### Players
- There are 2 players
- Each player has a fleet of ships & board
- Each player places their ships at valid coordinates on the board
- Player attacks on enemy's board by speaking the target cell coordinates
- Each player notifies the opponent of whether their attack was a _hit_ or _miss_
- Both players notify the opponent when either of them has lost all of their ships

##### Warships
- There are total of 5 warships.
- Ships can be placed either vertically or horizontally. 
- Ships cannot be moved or rotated after they have been placed.
- Each ship occupies a different number of cells on the board
- A ship is destroyed when all of its occupied cells are destroyed.

Name | Length (No. of Cells)
-|-
Carrier | 5
Battleship | 4
Destroyer | 3
Submarine | 3
Patroller | 2

##### Board
- The board is made up of 10x10 grid
- A cell which has been attacked once, cannot be attacked again
- If an attacked cell has a ship on it, it's marked with red dot
- Otherwise, the cell is marked with a white dot


### Technical Breakdown

Each of the components above can be seen as _Objects_. Time to figure out their properties & responsibilites

#### Warship
_Props:_
- name - `str`
- health - `int`
	- Tip: Number of cells occupied (aka length) is the health of a ship
- length - `int`
	- Tip: Length should not change. It will be required to generate correct coordinates while placement
- position - `Coord[]`

_Methods:_
- hasSunk - whether a ship is destroyed or not, returns `bool`
- takeHit - runs when a ship takes damage, decreases health. returns `undefined`

##### Implementation & Pseudocode

Test first approach. Let's figure out unit tests for Warship.

_Incoming Queries:_
- Test warship by asserting they have a proper public interface. Alongside the props & methods above they should've necessary accessors.
- Test `hasSunk` by asserting that it returns `false` when ship's health is > 0
- Test `position` by asserting that it returns `null` when ship hasn't been placed

_Incoming Commands:_
- Test `takeHit` by asserting the decrease in ship's health
- Test `position` by asserting a change in ship's position

_Outgoing Queries:_ N/A

_Outgoing Commands:_
- None for now. 
- Note: If implementing PubSub, test the methods with side-effects (so far there is only one, `takeHit`) by creating a mock & expecting the mock to have been called  with proper data


#### Gameboard
_Props:_
- size - `int`
- attackedCoords - `Set<CoordStr>`
	- Tip: Convert `Coord` object to a string. Will let us easily see if a coordinate has been _visited_ i.e., _hit_ or _missed_
	- ~~We will gradually build the board as the game is played~~
	- ~~`true` indicates a hit whereas `false` indicates a miss~~
	- We only need to keep tabs on whether or not a coordinate has been attacked. 
	- We only need to know whether a coordinate was a hit or miss at the time of attack. Afterwards, we don't need to query hits or misses.
- ~~shipsMap - `Map<Coord[]: Warship>`~~ Deprecated! 
	- ~~Confusion: Maybe we can use a `CoordStr` here. Join the coord array with a whitespace & use `includes`~~
	- Note: It is making things way too complicated. Ships should keep track of their position, not the gameboard. We are having trouble safely checking if a coordinate is occupied or not or maybe even some hidden bugs.
	- Just rn, my `isCoordOccupied` method broke because `Array.from` expects the 2nd argument to be a function. However, I was spreading the `keys` of the `shipsMap` to it, so it assumed that the rest of the argument to be a function. Spent half an hour debugging. Probably should refactor here.
	- I can either refactor to make ship include their position, or I can go with `CoordStr` implementation above.
	- The String approach seems to be working... Although, I feel like its brittle. I am not 100% sure nothing else will pop-up. Should I refactor?

_Methods:_
- canPlaceShip - checks if a ship can be placed at passed coordinate, returns `bool`
- canAttack - receives & checks if a passed coordinate can be attacked, returns:
	- ~~`bool` or `undefined`~~ ~~No. We need to share more information~~
	- `Object{ attackSuccess: bool }`

##### Implementation & Pseudocode
Gameboard will be _publicly_ contacted for:
- its size - Incoming Query
- checking if a coordinate can be attacked - Incoming Query
- checking if ship can be placed at a coordinate -  Incoming Query
- ~~placing ships at valid coordinates - Incoming Query? & Command~~

Gameboard will be _privately_ contacted for:
- recording attacks
- whether an attack succeded or not
- validating coordinates are not out of bounds
- ~~recording ships~~
- ~~whether an attack was a hit or miss~~
	- Tip: Use `any` to loop over the coordinates & check using `includes`
	- Tip: You might have to use `forEach` on the map
- ~~whether a ship was placed successfully or not~~

###### Tests:
Let's figure out tests:

_Incoming Queries:_
- Test gameboard by asserting it has proper public interface. Alongside the props & methods above they should've necessary accessors.
- Test `size` by asserting that it returns the correct size of the board
- Test `canPlaceShip` by asserting:
	- It returns `true` when coords are valid & not out of bounds
	- It returns `false` when coords are invalid &/or out of bounds
- Test `canAttack` by asserting:
	- It returns `true` when a coord has not been attacked
	- It returns `false` when a coord has been attacked before
- ~~Test `allSunk` by asserting that it returns `true` when all ships are destroyed~~
- ~~Test `allSunk` by asserting that it returns `false` when at least a single ship is alive~~

_Incoming Commands:_ 
___Deprecated___
~~Test `placeShip` by asserting that:~~
- ~~it places ship at valid coordinates by taking its length into consideration~~
- ~~it ignores placing ship at invalid coordinate~~
- ~~it ignores placing ship at out of bounds coordinate~~
- ~~it ignores placing ship when it's partially out of bounds~~

___Deprecated___
~~Test `receiveAttack` by asserting that:~~
- ~~it receives the attack at passed coordinate~~
- ~~it ignores attacks on previously attacked coordinate~~
- ~~it ignores attacks on invalid coordinate~~

_Outgoing Queries:_ Same as Warship

_Outgoing Commands:_
___Deprecated___
~~Test `receiveAttack` by asserting that:~~
- ~~it hits the ship which is at passed coordinate
	- ~~Mock it using a dummy ship object, make sure `receiveAttack` calls the ship's hit method only once~~ Just realized `receiveAttack` only receives a coordinate
	- Mock it by placing a `fakeShip` object on the board & later calling `receiveAttack`. We can then assert that `receiveAttack` notified the ship of the attack.~~

###### Psuedocode:
`canPlaceShip` Pseudocode:
- Given a ship & position
- If position is invalid return `false`
- Get ship's orientation & length
- According to orientation, check if ship is out of bounds, return `false`
- else, return `true`

`placeShip` Pseudocode:
- Given a position & ship
- If position is invalid or out of bounds, return `false`
- ~~If the distance b/w the board's edge & given position is less than ship's length, return `false`~~ 
	- Too complicated. There are 4 edges of the board. If we went with this approach, we will have to check for all 4 edges each time.
- If the ship's ending position is out of bounds, return `false`
	- Tip: Ending position can be calculated by adding ship's length to the given position
- ~~If position is occupied, return `false`~~
- Otherwise, calculate the ship's horizontal position by adding its length to the starting position
- If any of the generated position is occupied, return `false`
- else, Store the ship at that location
- return calculated position

`receiveAttack` Pseudocode:
- Given a position
- If position is invalid or out of bounds, return ~~`false`~~ ~~`null`~~:
	- `{ attackSuccess: false, shipHit: false }`
- If position has been attacked before, return ~~`false`~~ ~~`null`~~:
	- `{ attackSuccess: false, shipHit: false }`
- Otherwise, check if a ship exist at that position
- If it does, notify it of the hit
- Store the position in a _visited_ or _board_ map, marking whether it was a `hit` or `miss`
- return:
	- If ship hit: `{ attackSuccess: true, shipHit: true }`
	- else: `{ attackSuccess: true, shipHit: false }`

#### ShipManager
_Props:_
- dockedShips - `Map<Warship.name: Warship>`
- deployedShips - `Warship[]`
- occupiedCoords - `Map<CoordStr: Warship>`
	- Maps a coordinate to warship
	- Tip: Convert `Coordinate` object to string for easy lookup using `has` method

_Methods:_
- deployShip - deploys a ship at passed coordinate, returns `bool`
- attackShipAt - attacks a ship if it exist at the coordinate, returns:
	- `{ shipHit: bool, shipName: string, shipSunk: bool }`
	- Maybe more or less info depending on requirements
- getShip - retrieves a ship by name, returns: `Warship`
	- Note: It should only return ships which are docked. Not deployed. Reason being we only need this method when placing ships
- hasShipAt - whether there is a ship at coordinate or not, returns `bool`
- hasDeployedFleet - whether or not all ships have been deployed, returns `bool`
- hasFleetSunk - whether all _deployed_ ships have sunk, returns `bool`
- deployedShips - returns a list of all _deployed_ ships, returns `Warship[]`
- dockedShips - returns a list of all _docked_ ships, returns `Warhship[]`

##### Implementation & Pseudocode
ShipManager will be _publicly_ contacted for:
- deploying ships on coordinates - Incoming Command
- receiving attacks on ships - Incoming Query & Command
	- Query part: returns `{ shipHit: bool, shipName: string, shipSunk: bool }`
	- Command part: modifies the `occupiedCoords` map
- if _any_ ship exist at the given coordinate - Incoming Query
- querying all ships (docked & deployed) - Incoming Query
- querying a docked ship by name - Incoming Query
- whether all ships have been deployed or not - Incoming Query
- whether all _deployed_ ships have sunk or not - Incoming Query

ShipManager will be _privately_ contacted for:
- saving deployed ships
- saving docked ships
- generating ship coordinates
- mapping coordinates to ships

###### Tests:
Let's figure out tests:

_Incoming Query:_
- Test ship manager by asserting it has proper public interface. Alongside the props & methods above they should've necessary accessors
- Test `hasShipAt` by asserting that it returns `true` if a ship exist at coordinate
- Test `hasShipAt` by asserting that it returns `false` if a ship doesn't exist at coordinate
- Test `hasDeployedFleet` by asserting that it returns `true` when dock is empty
- Test `hasDeployedFleet` by asserting that it returns `false` when dock is not empty
- Test `hasFleetSunk` by asserting that it returns `true` when there are no deployed ships
- Test `hasFleetSunk` by asserting that it returns `false` when there are deployed ships
- Test `deployedShips` by asserting that it returns an array of all deployed ships. Initially, it should return an empty array since all ships would be at docks.
- Test `dockedShips` by asserting that it returns an array of all docked ships. Initially, it should return an array of all ships passed at the time of `ShipManager` object instantiation

_Incoming Commands:_
Test `deployShip` by asserting that:
- it places ship at valid coordinates by taking its length into consideration
- it ignores placing ship at an occupied cell
- it ignores placing ship when it overlaps another ship
	- Example: Ship of length 2 is placed at `[[1, 0], [2, 0]]`. Placing a ship at `[0, 0]` of length > 2 should be ignored

Test `attackShipAt` by asserting that:
- it returns a generic object with the following interface: `{ shipHit: bool, shipName: string, shipSunk: bool }`
- it returns `shipHit` `true` when a ship is hit
- it returns `shipHit` `false` when there is no ship at passed coordinate

#### Player
This one is a bit more involved. There are 2 players, a user & computer
Note: ___Incomplete___ My ass got lazy. Lol.

_User_
_Props:_
- name - `string`

_Methods:_
- 

_Computer_

##### Implementation & Pseudocode
Players will be _publicly_ contacted for:
- their board - Incoming Query
- whether their ships have been destroyed or not - Incoming Query
- attacking their opponent - Incoming Query & Command
- placing their ships - Incoming Query & Command
- autoplacing their ships - Incoming Command

Players will be _privately_ contacted for:
- randomly placing them on the board (only Bot/AI/PC Player)
- generating attack moves (only Bot/AI/PC Player)

###### Pseudocode:
`autoplace` pseudocode:
1. Reset the state of ShipManager & Gameboard
2. Get a random ship from ShipManager
3. While the fleet has NOT been deployed
	1. Get a valid random coordinate for that ship from gameboard
	2. Deploy the ship through ShipManager
	3. If the deployment was successful, get another random ship
	4. Repeat until done

#### _Post-Implementation Insights:_
Some insights which only come after implementing the program:

##### Done
- Apparently, the responsibility to generate a ship's position should belong to the ship itself. Reasons why I think that:
	- Update: Refactored as of 18th March
	- Some ships may require a different algorithm to calculate their position. In that case, our generic algorithm in Gameboard won't work.
	- Some ships may only be allowed to place horizontally or vertically, again, our algorithm will break.
	- Another issue is coupling, rn, our gameboard algorithm needs to know about a ship's length. You might argue that some coupling will exist & also the gameboard itself need to store the ship. You make some valid arguments. Here are my counter-arguments: 
		- For the coupling, our gameboard needs to know about the internal `length` prop of ship. I would rather inject this property instead of letting gameboard access it.
		- Gameboard needs to store the ship, yes, but wouldn't it be nicer if gameboard only stored the ship & notified it when it was hit rather than calculating its position? In storing the ship, it doesn't need to know anything about the internals of ship. It just takes it and saves it.
		- At the end of the day, it's about tradeoffs, I find that doing things this way will ensure much more maintaible code. Obviously, this implementain will be refactored post-mvp.
- Ships should keep track of their location. I can't believe I forgot such a trivial detail.
	- Refactored as of 18th March
- `Gameboard` has too many responsibilities. It's better to extract the ship saving responsibilities from it to a separate object which can then be injected into `Gameboard` at the time of its instantiation. Or just create a dependency in the gameboard itself. 
	- Update: Refactored as of 18th March
- ~~Still confused whether to test if `receiveAttack` is notifying the ship of hit or not. In my view, I see it as an outgoing message. But, at the same time, it feels like I am not testing behavior but implementation. In other words, my test is based on the assumption that it's the board's `receiveAttack` method which will call the `takeHit` method of a ship.~~ __Deprecated__ To answer the question: Yes. We should test Outgoing Commands by asserting that they were called.
- Probably shouldn't mess with component internals. In `ShipPlacementView`, it'll be a good idea to just use the Gameboard component as it is. I can build other views as required instead of mucking around with the internals of Gameboard Component. This will require refactoring of page structure a bit and styles as well.
- Another thing is to have a `GameActions` component, it'll contain a list of all buttons required for the game to function. I can use the builder pattern internally so that views can choose which component they would like to have.

##### Todo
- Refactor! Have `Game` & `GameView` objects, instantiate them in app's entry file & pass them to the controller! Make models have a `resetState` method
- Instead of recreating objects & views, clear their state! This will be solved on its own if you implement the point above it.

##### Unsure
- Had another insight. Maybe we can create a `Cell` object which contains information like coordinate, the cell contents (contains ship or empty), and whether it has been _attacked_ or not. Alas, I am too deep into the current implementation. One drawback (probably) would be that we will have to pre-generate the board with all the cells. Because later when we do `placeShip` we will have get the cell from board & ask it whether is it occupied or not. And when we do `receiveAttack` we will have to get the cell from board & tell it that it has been hit and the cell would internally see if it contains the ship and tell it to hit itself as well. Maybe, Post-MVP?
