# members_only_nodejs

Welcome to the Members Only Node.js application! This project is built using the Express.js framework and MongoDB for handling user sign-up, login, post storage, and managing access privileges.

## Features

- **User Authentication:** PassportJS is used for user authentications. Users can sign up, log in, and securely store their session information. Users password information is hashed and salted using the bcryptjs library. 
  
- **Post Management:** Registered users can create and view posts within the application.

- **VIP and Admin Privileges:** Special privileges are reserved for VIP members and Admin users. VIP members and Admins have access to additional features such as viewing post authors, and Admins can delete posts. Admins can also use admin panel to create secret keys for both VIP and Admin users. 

- **Secret keys to become VIP or Admin users is: 123456**

Live demo on <a href="https://members-only-nodejs.adaptable.app"> Adaptable.io</a>