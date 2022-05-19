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

> Data Storage
- [x] SQL Database vs. Datastore2
- [x] User Data Module

> Services
- [ ] Map Service
- [ ] Mode Service
- [x] Gold Service
- [ ] Trading Service
- [ ] Crafting Service
- [x] Interaction Service
- [x] Touch Service
- [x] Gamepass Service
- [x] Settings Service
- [x] Betting Service
- [x] Profile Service
- [x] Shop Service
- [x] Inventory Service
- [x] Twitter Service
- [x] Daily Reward Service
- [x] Menu Service
- [ ] Match Service

> Shared
- [x] Sword Data
- [x] Level Data
- [ ] Map Descriptions
- [ ] Mode Descriptions
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
- [ ] Crafting UI
- [ ] Trading UI
- [x] Interaction UI
- [x] Settings UI
- [x] Gamepass UI
- [ ] Map/Mode Selection UI
- [x] Betting UI
- [x] Inventory UI
- [x] Twitter UI
- [x] Gold UI
- [x] Profile UI
- [x] Daily Reward UI
- [x] Menu Buttons UI
- [x] Match Panel UI
- [x] Match Results UI