basic relationships in mongodb

# Basic relationships in mongodb

- 1:1
  eg: 1 movie can only have 1 name

* 1:MANY
  --1:FEW
  eg:1 movie can many awards, but number is limited
  --1:MANY
  eg: 1 movie can have hundreds/thousands of reviews
  --1:TON
  eg: 1 app can have millions of logs

- MANY:MANY
  one movie can hve many actors, but many actors can play in many movies too

# referencing vs embedding

- referenced/normalized
  - seperate models for embedded documents, eg movie and actors seperate models
- embedded/ denormalized
  - actors are embedded within movie model

# when to embed and when to reference

|                     | embedding                       | referencing                                           |
| ------------------- | ------------------------------- | ----------------------------------------------------- |
| relationhip type    | 1: FEW                          | 1:MANY                                                |
|                     | 1:MANY                          | 1:TON                                                 |
| data access pattern | data is mostly read             | Data is updated a lot                                 |
|                     | data does not change quickly    |                                                       |
|                     | high read /write ratio          | low read /write ratio                                 |
|                     | eg:movies+images                | eg: movies + reviews                                  |
| data closeness      | datasets really belong together | We frequently need to query                           |
|                     |                                 | datasets on their own                                 |
|                     | eg:USER+ email                  | eg: movies+ images(when we query images on their own) |

# Types of referencing

- child referencing
  - good for 1:few relationship, where parent holds an array of child references
- parent referencing
  - good for 1:many,1:Ton where each child holds reference to parent

* two way referencing
  - many to manay relatioship
  - eg, movie will hold an array of all actors refernces for that movie, similarly each actor holds an array of all movie refernces played by him

# Tour app data model

            1:many                  few:few
            parent referncing        embedding

bookings <-------------------tours <--------------->locations

<!-- |
                                |
                    few to few  |
              child referencing |
                                |
                            users -->

booking: users :1to many, parent referncing
user:reviews: 1 to many , parent referncing
tours: reviews : 1 to many, parent referncing

# security best practices

- brute force attacks

  - use bcrypt to make login requests slow
  - implement rate limiting
  - implement maximum login attempts

- cross site scripting(xss) attacks

  - store jwt in http only cookies at client side
  - sanitze user input
  - set special http headers( helmet package)

- Denial of service attack

  - impelment rate limiting
  - limit body payload (in post and patch request)
  - avoid evil regualar expressions

- NO sql qluery injectio
  - sanitizee user input

# Best practices

- always use https
- create random passward reset token with expiry dates
- Deny access to jwt after password change
- dont commit sensitive config data to git
- dont sent error details to client
- Prevent cross site request forgery( csurf package)
- Requrie re-authentication before a high value acation
- Implement a blacklist of untrusted jwt
- confirm user email address after creating account
- Confirm user email address after first creating account
- keep user logged in with refresh tokens
- Implement two factor authentication
- Prevent parameter pollution causing UncaughtExceptions
