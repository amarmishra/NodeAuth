# NodeAuth


Setting up the project:

----------------------------------- SOFTWARE REQUIREMETS--------------------------------

1. Install NODE js( js environment server ) LTS. (latest version). This includes NPM- Node Packet Manager. 
2. Install MonogDb LTS (latest version) and start MongoDb service.
3. Install Git .

4. Pull this repository from git.

Run "npm init" command in the root folder of the project. This will load following dependencies:

    "base-64": "^1.0.0",
    "bcrypt": "^5.1.0",
    "connect-flash": "^0.1.1",
    "connect-mongo": "^4.6.0",
    "connect-mongodb-session": "^3.1.1",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.0.3",
    "ejs": "^3.1.9",
    "express": "^4.18.2",
    "express-ejs-layouts": "^2.5.1",
    "express-flash": "^0.0.2",
    "express-session": "^1.17.3",
    "mongoose": "^7.0.1",
    "node-fetch": "^2.6.9",
    "nodemailer": "^6.9.1",
    "nodemon": "^2.0.21",
    "passport": "^0.6.0"

5. Add .env file in the root folder and add following variables:

    EXPRESS_SERVER_PORT_NO= Port to run express server 
    MONGODB_SERVER_URL= Connection string to link mongoDb database
    EXPRESS_SERVER_URL= Origin Url of Machine running Express server

    # session secret key for cookie
    SESSION_SECERET_KEY= Session secret key

    JWT_RESET_TOKEN_SECERET_KEY= Reset token key(for reset password token)

    # google auth credentials
    GOOGLE_AUTH_URI= Google Oauth Server Url
    GOOGLE_AUTH_CLIENT_ID= Your Client Id
    GOOGLE_AUTH_CLIENT_SECRET= Your Client Secret Key
    GOOGLE_AUTH_REDIRECT_URI= Rediret Uri in the server

    # gmail credentials
    GMAIL= Your gmail address (xyz@gmail.com)
    GMAIL_PASSWORD= Actual Password or 16 letter key (if 2Factor Auth is enabled on google account)
    
    # bcrypt_salt_number
    BCRYPT_SALT='10'



