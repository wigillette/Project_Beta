# Project Beta
## Refining my codebase from project alpha to incorporate better organization and scalability to limit redundancy and promote efficiency. 
### This codebase uses Roact, Rodux, and Knit from the roblox-ts library.
### 1. SHARED
> src/shared:
> - Contains datatypes and various settings relevant to both the client and server sides
> - Enables the client side to display this information on the view
> - Allows the server side to use this information in various algorithms
### 2. SERVER
> src/server/Services:
- Contains the server-side business logic for the Knit services, facilitating client-server communication by organizing server-side information and remotes
> server/main.server.ts:
- Executes on the server directly after the first player connects to the game
- Iniitalizes the server-side services
### 3. CLIENT
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
