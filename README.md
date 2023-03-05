# My Photo Website
My Photo Website is a photo sharing website similar to Imgur, but with fewer features. \
You can register for an account, view other users' photos, upload your own photos, and comment on photos. You may also search for photos with a matching title or description.

My Photo Website uses MySQL, Express, and Handlebars. MySQL is for the database, Express is for the back end, and Handlebars is for the front end. \
My Photo Website was created for my university's Web Development course in Fall 2021.

#### This application was not designed entirely with security in mind. This was more a project for learning.

# Installation Instructions
You only need to complete the installation process once. Also, you will need MySQL and Node.js to run the server.

### Step 1: Enter your database credentials into the `config.env` file in the `application` directory.
Enter your database username in the `DB_USER` field and your database password in the `DB_PASSWORD` field, replacing `root`.\
Example: `DB_USER=admin`, `DB_PASSWORD=password`.

You probably should not change anything else in `config.env`.

### Step 2: Install the dependencies and build the database.
Run the following commands from the terminal, assuming the current directory is `.../My-Photo-Website`:
1. `cd application` (your current directory should now be `.../My-Photo-Website/application`)
2. `npm i` (wait for the install to finish before proceeding)
3. `npm run build_db` (this creates the database and tables in MySQL, if they do not already exist)

#### You have now finished installing My Photo Website.

# Run Instructions
These steps must be repeated each time you wish to start the server.

Run the following commands from the terminal, assuming the current directory is `.../My-Photo-Website`:
1. `cd application` (your current directory should now be `.../My-Photo-Website/application`)
2. `npm start` (starting the server will take a few seconds)

#### The server is now running. You can go to the home page by entering `localhost:3000` into your browser's address bar.