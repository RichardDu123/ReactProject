## Pre-requisite

# Firebase

Create a firebase project and replace the app configuration under

```
src/firebase/firebaseConfig.js
```

CORS needs to be disabled for storage, follow instructions [here](https://stackoverflow.com/questions/71193348/firebase-storage-access-to-fetch-at-has-been-blocked-by-cors-policy-no-ac)

## Available routes

### Home pages

`/home` - Landing page with search bar and featured garages<br />
`/garages` - Browsable list of garages<br />
`/garage` - A detailed view of a garage<br />
`/item` - A detailed view of an item in a garage<br />

### Auth pages

`/auth/login` - Login<br />
`/auth/register` - Register<br />
`/auth/reset` - Request password reset<br />
`/auth/new-password` - Reset account with a new password<br />

### Dashboard pages

`/dashboard/home` - User's dashboard homepage<br />
`/dashboard/account` - User's account page<br />
`/dashboard/analytics` - User's analytics page<br />
`/dashboard/garage` - User's garage<br />
`/dashboard/favorites` - User's favorites list<br />
`/dashboard/items` - User's item list<br />
`/dashboard/new-item` - Adding a new item to garage<br />
`/dashboard/upgrade` - Upgrade page to increase account limit<br />

### Admin pages

`/admin/home` - Admin home page<br />
`/admin/database` - Admin database management page<br />
`/admin/analytics` - Admin analytics page<br />

## Authentication

### Dashboard

To access the user's dashboard, the user must be authenticated and logged in.
The pages will be available after the context has been updated with the user object.
By default, the user object is set to null.

### Admin

To access the admin dashboard, the user must have an admin role and the admin context be set to true.
By default, it is set to false.
