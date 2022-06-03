# Project Beta
## Refining my codebase from project alpha to incorporate better organization and scalability to limit redundancy and promote efficiency. 
### This codebase uses Roact, Rodux, and Knit from the roblox-ts library.
### **SHARED**
> src/shared:
- Contains datatypes and various settings relevant to both the client and server sides
- Enables the client side to display this information on the view
- Allows the server side to use this information in various algorithms
### **SERVER**
> src/server/Services:
- Contains the server-side business logic for the Knit services, facilitating client-server communication by organizing server-side information and remotes
> server/main.server.ts:
- Executes on the server directly after the first player connects to the game
- Iniitalizes the server-side services
### **CLIENT**
> src/client/Components:
- Comprises of the various Roact UI components
- Stores all the elements and styling for each section of the view
> src/client/Controllers:
- Handles the creation and initialization of the Roact components
- Stores all the components of the same type and handles the shared business logic between them
> src/client/Services:
- Contains the client-side business logic for the Knit services, allowing for smooth client-side communication
- Utilizes the controllers for initialization of Roact components as per the request from the server
> src/client/UIProperties:
- Provides styling information relevant to every component such as color schemes and UI properties
- Contains animation libraries for tweening the properties of UI elements
> client/main.client.ts:
- Executes on the client directly after the respective player connects to the game
- Initializes the client-side services
### **TASK LIST**
> UI Properties Setup
- [x] Tween Animation Handler, Ripple Effect
- [x] Color Schemes
- [x] Dynamic Scrolling
- [x] UI Property Layouts
- [x] Dynamic/Spinning Viewport Frame
- [x] Spritesheets

> Reducers
- [x] Shop Reducer
- [x] Inventory Reducer
- [x] Gold Reducer
- [x] Profile Reducer
- [x] Twitter Reducer
- [x] Settings Reducer
- [x] Daily Reward Reducer
- [x] Match Reducer
- [x] Betting Reducer
- [x] Results Reducer
- [x] PlayerList Reducer
- [ ] Crafting Reducer

> Data Storage
- [x] SQL Database vs. Datastore2
- [x] User Data Module
- [x] Kills/Wins/Donations Ordered Datastores

> Miscellaneous
- [x] Sword on Back
- [x] Obby Chest
- [x] Spinning coins in lobby
- [x] Lobby/Match Music
- [x] Lobby Animations
- [x] Practice Arena
- [x] Floating Health Bar

> Game Modes
- [x] FFA
- [x] TDM
- [x] SFT
- [x] Ghosts
- [x] Teamswap
- [x] Streak
- [x] PTL
- [x] Juggernaut

> Services
- [x] Voting Service
- [x] Gold Service
- [x] Interaction Service
- [x] Touch Service
- [x] Developer Product Service
- [x] Gamepass Service
- [x] Settings Service
- [x] Betting Service
- [x] Profile Service
- [x] Shop Service
- [x] Inventory Service
- [x] Twitter Service
- [x] Daily Reward Service
- [x] Menu Service
- [x] Match Service
- [x] Chat Service
- [x] Friend Service
- [x] Badge Service
- [x] Arena Ticket Service
- [ ] Crafting Service

> Shared
- [x] Sword Data
- [x] Death Effect Functions
- [x] Level Data
- [x] Map Descriptions
- [x] Mode Descriptions
- [x] Interaction Information
- [x] Location Data
- [x] Settings Info
- [x] Daily Reward Values

> Material Components
- [x] Snackbar Component/Service/Controller
- [x] Dynamic List Component
- [x] Grid Component
- [x] Slider Component
- [x] Circular Progress Bar Component
- [x] Rectangular Progress Bar Component
- [x] Card Component
- [x] Toggle Button Component
- [x] Text Box Component

> Advanced Components
- [x] Intro UI
- [x] Shop UI
- [x] Interaction UI
- [x] Settings UI
- [x] Gamepass UI
- [x] Map/Mode Selection UI
- [x] Betting UI
- [x] Inventory UI
- [x] Twitter UI
- [x] Gold UI
- [x] Profile UI
- [x] Daily Reward UI
- [x] Menu Buttons UI
- [x] Match Panel UI
- [x] Match Results UI
- [x] Gamepass UI
- [x] Playerlist UI
- [x] Spectate UI
- [x] VIP Shop UI
- [x] Arena Tickets Container UI
- [x] Hover Notifications
- [ ] Arena Ticket Info UI
- [ ] Crafting UI

> Surface Components
- [x] Profile Board
- [x] Maps Board
- [x] Modes Board   
- [x] Top Kills Board
- [x] Top Donors Board
- [x] Top Wins Board
- [x] Donations Board
- [x] Group Advertisement Board
- [x] Gamepass Board
- [x] Profile Board Badge Container + Reset Stats

> Bug/Revamp List
- [x] TouchService UIs overlaying on betting/voting/results UIs
- [x] Use componentDidUpdate to reset state on betting and voting UIs
- [x] Selected Maps and Modes not changing
- [x] Kills not changing in leaderboard
- [x] Betting needs to work with teams
- [x] Results UI needs to display winner, exp earned, level
- [x] Negative experience
- [x] Viewport blocky head bug
- [x] Settings Packages Function
- [x] Menu UIs overlaying on match UIs
- [x] Use icons in Results UI
- [x] Blocky head in viewport frames; meshes not loading
- [x] No set state in render methods for Surface UIs
- [x] MVPs at boards
- [x] Session stats for profile boards
- [x] Donation particles
- [x] Level up particles/SFX
- [x] Get Name from UserId attempt to yield error
- [x] Gamepass items on respawn (signs, hot cocoa, etc.)
- [x] Add players prop to profile board
- [x] Get rid of touch service for chest after it is gone
- [x] VIP Gamepass: Iceberg lounge, shop discount, playerlist tag
- [x] PTL didn't end when leader died
- [x] Package setting not working correctly
- [x] Revamp lower left corner
- [x] Certain gamepasses need to award perks on join (i.e. starter up, katana, golden katana)
- [x] Helpful Tips in Chat
- [x] Revamp Snackbar using queue
- [x] Better way of collecting badge info on server
- [x] Update profile service to contain user KDR stats
- [x] Refresh ODS leaderboards after a certain number of changes

> Future Updates
- [ ] Trading
- [ ] Guilds
- [ ] Pets?
- [ ] Elixirs?
- [ ] Timed Perks
- [ ] Old Animations
- [ ] Premium Daily Reward Chest
- [ ] New Game Modes: KOTH, Power Ups, Golden One, Soccer, CTF