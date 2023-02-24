# Art 2.0

## Description

It's a webpage where the user can Create, Sell and Buy "NFTs".
 

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **sign up** - As a user I want to sign up on the webpage so that I can create, sell and buy
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **gallery list** - As a user I want to see all the content available on the gallery from all the users
- **"NFTs" create** - As a user I want to create some NFTs so that I can display and sell My Art
- **"NFTs" detail** - As a user I want to see the NFTs details and be able to buy them
- **recharge credit** - As a user I want to be able to recharge my credit to buy Art


## Backlog

User profile:
- see my profile
- edit my profile details
- create the Art and visualize it
- recharge my credit

Gallery
- Display the Art from all users

Homepage
- Brief description of the webpage


## ROUTES:

- GET / 
  - renders the homepage

- GET /auth/signup
  - redirects to /signup
  - renders the signup form 
- POST /auth/signup
  - redirects to /login
  - body:
    - username
    - password
- GET /auth/login
  - redirects to /login 
  - renders the login form
- POST /auth/login
  - redirects to /profile if user logged in
  - body:
    - username
    - password
- POST /auth/logout
  - body: (empty)

- GET /profile
  - renders the profile details
- GET /profile/:id/solicitude-details
  - renders the solicitude details
- POST /profile/:id/solicitude-details/:response
  - update the Data Base with the request's result
- GET /profile/edit
  - renders the update form of the user details
- POST /profile/edit 
  - update the Data Base with the user details
  - body:
    - firstName
    - lastName
    - url (image)
- GET /profile/create
  - renders the create "NFT" form
- POST /profile/create
  - redirect /profile
  - body:
    - url (image)
    - Name
    - CollectionType
    - price
    - owner
- GET /profile/:id/details
  - renders the "NFT" details
- POST /profile/:id/details
  - change the for sale status
- GET /profile/credit
  - renders the recharge credit form
- POST /profile/credit
  - creates a credit solicitude to the admin
  - body:
    - credit
    - pendingApproval
    - owner

- GET /gallery
  - renders the "NFTs" gallery
- GET /gallery/:id/details
  - renders the selected "NFT" details
- POST /gallery/:id/details
  - renders the transaction of the purchase

## Models

User model
 
```
username: 
 - type: String
 - trim: true
 - required: true
 - unique: true
password: 
 - type: String
 - required: true
url: 
 - type: String,
 - default:"https://res.cloudinary.com/dhtrxjdas/image/upload/v1676899895/art-project-images/t9uncxxkkovbbzfc6bg5.png"
firstName: 
 - type: String
 - trim: true
 - required: false
lastName: 
 - type: String
 - trim: true
 - required: false
wallet: 
 - type: Number
 - default: 0
userType: 
 - type: String
 - enum: ["user", "admin"]
 - default: "user"

```
Nft model

```
name: String,
url: String,
isForSale: 
 - type: Boolean
 - default: false
price: 
 - type: Number
 - required: true
owner: 
 - type: mongoose.Schema.Types.ObjectId
 - ref: "User"
collectionType: 
 - type: String
 - enum: ["coolstuff", "weirdstuff", "patata"]
     
``` 
Solicitude model

``` 
credit: Number
owner: 
 - type: mongoose.Schema.Types.ObjectId
 - ref: "User"
pendingApproval: 
 - type: String
 - enum: ["accepted", "rejected", "pending"]
 - default: ""

``` 

## Links

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/dagmaro/Art_2.0.git)

[Deploy Link](https://art-2-0.cyclic.app)

### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1jQJGZk-U8LpZKcONCfmKM7b2xUN8aABzR9dPTFFhdCo/edit?usp=sharing)