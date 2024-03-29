20230227-12-15 -  Started writing down the non-technical breakdown of the game. I think doing so will give me a better idea of the app. 

20230227-15:26 - Had lunch. Now it's time to write down the techincal breakdown. I will think from the POV of Objects. The components in non-techincal breakdown can be used as Objects. I will figure out their responsibilities & properties. Still have to consider whether to use PubSub or not.

20230227-16:54 - Well. It's a bit more complicated than I thought. I have separated the components into Objects. Ship object was by the far the simplest. Apparently, I should start by implementing ship first then. I can't yet figure out whether should placing ships be the responsibility of players. It seems like so. But then, I might have to encapsulate the ships into player as an array of ships?

20230227-17:41 - Can't figure out. Let's just implement the ships first. Oh, right. I have to create the basic setup first.

20230227-23:33 - Done for today. Guess what. I should probably create a template repository, setting up a new project is such a chore... Anyways.

20230228-17:50 - Starting now. Well as the main motive is to learn TDD. I will be writing a Unit test for Warship object first.

20230301-11:46 - Another day. Finished implementing warship, tests came out nicer than I had expected. Good! Now, it's time for Gameboard. Hmm, I will have to write down the techincal breakdown for it first tho. Let's go!

20230301-13:48 - Still writing the breakdown. Took some breaks in between. Progress seems slow. Hopefully, the breakdown will help pace implementation. Anyways. It's time for lunch. Afterwards, I will be finishing up the breakdown &, hopefully, Gameboard as well.

20230301-14:50 - Well. Here I am. Time to start working on gameboard. Right, breakdown. Man, proper planning is so time consuming.

20230301-17:34 - Done with Breakdown. It took a while. Now onto implementation. Hopefully, there won't be any hidden hurdles. I decided that the gameboard will be built as the game progresses, there is no point in prebuilding an empty board. Just waste of memory. Premature optimization? Not really. That's how I usually work through them. I did the same in TTT. Only saved the cells as the game progressed.

20230302-12:50 - Partially, finished `placeShip` implementation & some of its tests last night. Having implemented it, I had an insight that apparently, gameboard shouldn't be responsible for generating a ship's position. Because, if we are thinking from the POV of future extensibility, some ship's may have a position which cannot be generated by the generic algorithm in our gameboard. Another reason being, ship's may be allowed to place themselves horizontally or vertically in the future. In that case, our algorithm may need to change. That's why, I feel like it's apparently a good idea to encapsulate position generation into `Warship`. Obviously, the ship won't have a position when its created, position will be generated & added to a ship later. Gameboard still needs to play a role here however. Since, ship won't know if they are going out of bounds. So, they both need to talk to each other. Hmm, I might leave this for now & refactor it later, post-mvp. For now, gameboard is responsible.

20230302-18:13 - Done with `placeShip`. Goddamn, it is taking me way too long. Hopefully, this will be complete by Sunday? I hope. 

20230303-16:14 - Well. I couldn't finish `gameboard` yesterday either. However, I had a lot of insights by talking to GrenadePit on discord. Guy is amazing, gave me such a thorogh response & actually tried understanding my approach. Anyways. He gave me some useful insights which may help improve the structure of my code a bit more. My question was different as I wanted to know how I might test the my gamboard's `receiveAttack` method calls a ship's `takeHit` method. It's necessary to call it otherwise my game would have invincible ships lol. You might argue that it's not necessary and way to trivial to worry about as I just have to call `ship.takeHit()` in the `receiveAttack` method & there is no way it can break. You would be right. However, we won't be testing it anymore, we would be relying on the fact that the method is being called. In other words, we won't be able to prove that a ship is being notified about hits without looking in `receiveAttack` & always ensuring that it is calling the method correctly. Now, I can mock it & be 100% sure that it's being notified of hits & that also correctly. Anyways. Now. Onto some bad news, due to some personal issue in the morning. I haven't been able to study at all. Also, I have barely slept for more than 3-4 hours last night. I am here now... but I feel really sleepy. Perhaps, I should rest a bit before studying...

20230305-12:13 - Hi. I am back. Don't. Just don't. Yes. We are still on the same spot. Yes I was planning to finish Battleship by today. Yes. I couldn't. Whatever. Let's just work on it. I might've to refactor a lot of stuff. Not a lot, but yeah. Let's just get it working, I just realized that my `Gameboard` is sneaky. It's hiding another class or factory within itself. It shouldn't keep track of ships itself, it can delegate that responsibility to some other object. `ShipManager` or something. We will see later.

20230306-10:35 - My god. It takes me so long to finish projects. I gotta speed up. It'll be 10 days since I started working on battleship, but only of them were spent working on it. 7 if I include today. Anyways. I should modify my ships to save their location. Then create a `ShipManager` object which handles managing a collection of ships, finding ships, setting their location etc. This way my `Gameboard` won't have as much responsibility. But probably, I should just go with my current implementation, yes it can be improved. But I need to get the app working first.

20230306-11:59 - Done with gameboard. Thank God. Now I can work on implementing `Players`. Man, I am moving at a slowpoke speed. Anyways. Time to work on `Player` module.

20230308-16:24 - Added `allSunk` method to Gameboard and refactored `receiveAttack` method to return a generic object containing necessary information about the attack. Also changed the way ships were mapped to their location, instead of mapping them directly to an array of coordinates. I had to stringify the coordinate array & search through it using the `includes` method. All this had to be done because of how `Array.from` api works. A detailed response is in Overview file. Basically, `from` optionally expects a function as its 2nd argument so spreading the content of an iterable directly into it was not the best idea. It was sort of a sneaky bug, it worked for 2 ships but when more ships were added it broke. Anyways, I had to resort to stringifying the whole ship's position. But now, it has rendered `Map` useless, I can just use a generic `Object`. I haven't changed to Object yet because I find that Gameboard is too complicated. Too many responsibilites. Besides, ships should be keeping track of their location, not the gameboard?! I am stopping myself from unnecessary refactors because I want to get done with Battleship asap. Now, hopefully, I can work safely on `Player`, it has its own challenges...

20230308-22:35 - I have been thinking and the more I think, the more it feels like I need to refactor. Apparently, I'll have to refactor. Too many oversights.

20230309-15:09 - Fixed a nasty bug in `Gameboard`, also still considering refactoring.

20230310-17:21 - Too much time have been wasted. I'll refactor, at least it'll be better than just contemplating about it. `ShipManager` here I come.

20230311-22:29 - Hey. It's me! Again. Anyways. Refactoring is underway, and I have thought of using a wrapper Object which encapsulates both `ShipManager` & `Board`. I am thinking of calling it `Battlefield` or `BattleManager`, basically, acts as a facade around the dependencies. My `Player` objects can simply use this facade & not worry about implementation. Instead, they can implement a `Publisher` interface which allows them to notify of events to their views. Not entirely sure where I want to implement the Observer here. It makes sense in `Player` since there is least resistance & my other dependencies won't be coupled to the observer.

20230313-20:04 - Done with refactoring `Gameboard`. I am procrastinating way too much. Let me just quickly implement `ShipManager`.

20230315-22:45 - Working on `ShipManager`, discovered that on ships we should generate their position. Time to modify `Ship` so that they can generate their position.

20230318-23:01 - Done with `ShipManager`. I can finally work on `Player` now. Anyways. The past few days have been chaotic. Hopefully, I will be done with battleship in the upcoming 3~4 days - provided nothing more of these _circumstances_ happen.

20230319-22:29 - Thought out the basic plan for `Player`. It's in my head. Also, discussed on discord to see if my logic is correct or not. I am still not clear with how to make sure that the player would have placed their ships before starting a new game. `Game` module seems a bit too complicated. I will have to see help.

20230321-17:54 - Working on adding a randomCoord method to the `Gameboard`. This is so that I can retrieve a random valid coord which the Bot can utilize to generate its random attacks. I am thinking of making this method behave differently.

20230323-12:23 - Done with `Player` base class. I can finally work on implementing the `Bot` factory now. The `Bot` will utilize the base class `attack` method. Internally, it'll generate it's attack moves. There are many things which can be refactored. However, none of them are immediately helpful. I am also facing a dilemma whether to encapsulate `ShipManager` within `Gameboard` or keep them unaware of each other's existence. The latter enables me to have loose coupling, while the former will make my code easier to follow through, in other words, `Gameboard` will be _complete_ in a way that `Player` will simply become a wrapper around it. The downside of this is, ofcourse, tight coupling to the `ShipManager` class which will make it harder to test. I am not sure. Thus, for now, I am going with the loose coupled objects.

20230323-13:26 - Done with `Bot` as well. Now, I have to think about this game loop. And UI.

20230401-16:12 - Done with Battleship! Finally. Sure, so many things can be improved in the GameController. I even have an [[Battleship_Module_Graph.excalidraw|Battleship Dependency Graph]]  now, it helps, also, it'll help in cleaning the code a bit more. Anyways. I can refactor whenever I want now.