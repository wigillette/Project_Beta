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
- [ ] UI Property Layouts
- [x] Dynamic/Spinning Viewport Frame
- [x] Spritesheets

> Reducers
- [x] Shop Reducer
- [ ] Menu Reducer

> Data Storage
- [ ] SQL Database vs. Datastore2
- [ ] User Data Module

> Services
- [ ] Map Service
- [ ] Mode Service
- [ ] Gold Service
- [ ] Trading Service
- [ ] Crafting Service
- [x] Interaction Service
- [x] Touch Service
- [ ] Map/Mode Selection Service
- [ ] Gamepass Service
- [ ] Settings Service
- [ ] Betting Service
- [ ] Shop Service

> Shared
- [ ] Sword Data
- [ ] Level Data
- [ ] Map Descriptions
- [ ] Mode Descriptions
- [x] Interaction Information


> Material Components:
- [x] Snackbar Component/Service/Controller
- [x] Dynamic List Component
- [x] Grid Component
- [x] Slider Component
- [x] Circular Progress Bar Component
- [x] Rectangular Progress Bar Component
- [x] Card Component
- [ ] Navigation Bar Component
- [x] Toggle Button Component
- [x] Text Box Component

> Advanced Components:
- [ ] Intro UI
- [x] Shop UI
- [ ] Crafting UI
- [ ] Trading UI
- [x] Interaction UI
- [ ] Settings UI
- [ ] Gamepass UI
- [ ] Map/Mode Selection UI
- [ ] Betting UI
