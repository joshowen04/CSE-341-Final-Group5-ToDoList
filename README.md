# CSE341-Final-TodoList

# Description:

An advanced to do list API
...

# Routes:

GET
POST
PUT
DELETE
...
...
...

# Authors:

Parker Mortensen
Joshua Owen
Daniel Rasmussen
Sean Layton
Jared Vance

# Proposal doc:

https://docs.google.com/document/d/16nMwgr9S_E35Toajd3g8wwD6v4jjDxmXDKnScWwjdPw/edit?usp=sharing

# GITHUB:

https://github.com/joshowen04/CSE-341-Final-Group5-ToDoList

# RENDER:

https://cse-341-final-group5-todolist.onrender.com

# MONGODB_URL

mongodb+srv://team8:<pass>@cse341winter2023.vtlmrmi.mongodb.net/CSE-341-Final-Group5-ToDoList

# Youtube: 
https://www.youtube.com/watch?v=tx4DPjX9M_4
# Schema draft:

Collection 1 - Users (2 fields): (
id,
username)
Collection 2 - To-Do (9 fields): (
user id,
id,
start date,
goal date,
last updated,
title,
text,
type,
priority
)
Collection 3 - Doing (10 fields): (
user id,
id,
start date,
progress,
last updated,
goal date,
title,
text,
type,
priority)
Collection 4 - Done (10 fields): (
user id,
id,
start date,
goal date,
actual end date,
last updated,
title,
text,
type,
priority)
