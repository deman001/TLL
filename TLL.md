# Tool Lending Library

## Overview

The Tool Lending Library (TLL) is a web application designed to create a sharing economy platform where users can lend and borrow tools within their community. The application aims to promote sustainability, reduce waste, and foster a sense of community among users.

## Summary

MERN based web application, that mimics social media platform with a twist of location limitation. Allowing for neighbors to share with each other. The TLL web application will be built using HTML5, CSS3, and JavaScript for the frontend and Node.js and MongoDB for the backend. We will utilize frameworks and libraries like Express, Material UI, and others to ensure a robust, user-friendly, and efficient application.


## Specifications
1. Application should be built using NodeJS or any framework dependent on NodeJS as a backend programming language
2. Host on Heroku hosting server
3. Profiling: You must design and implement a set of features representing user profiles. Using the profiling features, users can update their personal information, and can see the profile of other users.
4. User Authentication and Authorization: Your system must authenticate users based on passwords . Your application also needs to support at least one 3rd party authentication such as Google/Facebook/Github sign-in, or two-factor authentication. Users have different roles in your system, and you must authorize them when they are conducting certain tasks. For instance, a normal user cannot change the password of other users, or update someone else’s personal information. Don't do this yourself, 
5. Rating and Commenting: When users use a shared resource provided by another user, they must be able to rate and comment on that offering. Using this commenting and rating features, others can decide whether to use that resource or not. For example, on AirBNB, a guest can review the host and the place. Others will read reviews and decide whether to rent that place or not.
6. Database: obviously the system will have to maintain a database to store information. You must use MongoDB.
7. Social Network: In any sharing economy platform, we will have a social network. In such networks, users can interact with one another, for example, then have chat session or share information.
8. Search and Recommendation System: Your system can provide the basic functionalities to search the shared economy. Using this feature, users should be able to search and discover what they want to use. Moreover, using the same recommendation system, the system should show similar things when a user is browsing a certain item. For instance, when one is looking at a room on AirBNB, the system lists similar properties on the same page. 
9. Admin: You should provide basic admin functionalities, including but not limited to changing passwords, updating and deleting information, and initializing/repopulating the database. 
10. Chatroom: Users can view and send messages in real-time using socket technology.

## Features and Functionalities
1. User registration and authentication
2. Profiling and user management
3. Tool listing, searching, and recommendation
4. Social networking and communication
5. Rating and commenting
6. Admin functionalities
7. Robust database management
8. Private messaging


## User Roles

All Users: Normal users can register, create a profile, list tools for lending, search for tools, request tools for borrowing, rate and comment on tools, and interact with other users via the social networking feature.

## Features:
- [ ] Registration Page
	- [X] Core Page
		1. Able to Upload Profile Picture
		2. Drag and Drop with hover detection with Dropzone
		3. Clicking on it, will launch Finder/File Explorer
	- [X] Error Handling
		1. Requiring email and password (other items optional)
	- [ ] Google Signup
		1. Google Login
		2. Decoding to get Google information
	- [ ] Facebook Signup (Optional)
- [ ] Login Page
	- [X] Core Page
	- [X] Error Handling
		1. Require email and password
	- [ ] Google Login
	- [ ] Facebook Login (Optional)
- [X] Home Page
	- [X] User Column
	- [X] Posts Column
	- [X] Friends List Column
- [X] Navigation Bar
	- [X] Title
	- [X] Search bar
	- [X] Dark/Light Mode Toggle
	- [X] Messages
	- [X] User Drop Down
		1. Logout
- [X] Widgets
	- [X] Friends List
	- [X] MyPost
	- [X] Posts
	- [X] Post
	- [X] User
- [ ] Private Messaging
	- [ ] One to One messaging
	- [ ] Group messaging (Optional)
	- [ ] Reactions to messages (emojis such as like or dislike) (Optional)
	- [ ] Allow users to edit messages (Optional)
- [ ] Search
	- [ ] Through All Text
- [ ] Borrow tools
	- [ ] Leasee has a post for a tool, a user will have a button to "Borrow" the tool.
		1. "Borrow" takes the user to a seperate page like a transaction process (TP)
		2. TP contains description of the tools, interactive calendar, Submit Button
			- a. Calendar will be simple 
	- [ ] Automated availability calendar
- [ ] Lease tools
	- [ ] Upload new tools through posts
	- [ ] Upload from personal profile page

#### Borrowing/Lending
- [ ] Tool in DataBase
	- [ ] Schema : 
		1. Owner
		2. Maker
		3. Model
		4. Short Description (char limit 50)
		5. Long Description
- [ ] Lending in DataBase
	- [ ] Schema :
		1. Tool
		2. Borrower (user)
		3. startDate
		4. endDate
- [ ] Backend
	- [ ] Tool Endpoints:
		- [ ] CRUD operations
			1. Create
			2. Read
			3. Update
			4. Delete
		- [ ] Routes
			1. POST /tools (to create a new tool)
			2. GET /tools/:id (to get information about a tool)
			3. PUT /tools/:id (to update a tool) 
			4. DELETE /tools/:id (to delete a tool)
	- [ ] Lending Endpoints:
		- [ ] CRUD operations
			1. Create
			2. Read
			3. Update (Optional)
			4. Delete (Optional)
		- [ ] Routes
			1. POST /lendings (to create a new lending)
			2. GET /lendings/:id (to get information about a lending)
			3. GET /lendings?tool=:toolId (to get all lendings for a particular tool, useful for determining which dates are already booked)
- [ ] Frontend
	- [ ] Tool React Components
		1. A form for creating/updating tools
		2. Displaying a tool (in posts)
		3. Listing all of a user's tools (in user profile)
	- [ ] Lending React Components
		1. A form for creating lendings, includes a date picker
		2. Displaying a lending
	- [ ] Calendar React Component
		1. react-calendar or react-date-range
- [ ] Redux
	- [ ] Tool
		1. Actions for creating, fetching, updating, and deleting
		2. To handle above actions and update the state
	- [ ] Lending
		1. Actions for creating and fetching lendings
		2. To handle these actions and update the state










