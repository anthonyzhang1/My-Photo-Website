# My Photo Website
My Photo Website is a photo sharing website similar to Imgur, but with fewer features.

This application uses MySQL, Express, and Handlebars. MySQL is the database, Express is the backend, and Handlebars is used for the frontend.\
You will need MySQL and NodeJS to run the server.

This application was made in my university's Web Development course, with a few improvements made to the application since then.

# Build Instructions
You only need to complete the build process once.

### Step 1: Enter your database credentials into the `config.env` file in the `application` directory.
Enter your database username in the `DB_USER` field and your database password in the `DB_PASSWORD` field, replacing `root`.\
Example: `DB_USER=admin`, `DB_PASSWORD=password`.

You probably should not change anything else in `config.env`.

### Step 2: Set up the database and install the dependencies.
Run the following commands from the terminal, assuming the current directory is `/My-Photo-Website`:
1. `cd application` (your current directory should now be `/My-Photo-Website/application`)
2. `npm run build_db` (this creates the database and tables in MySQL. If the database/table already exists,
the database/table will not be created.)
3. `npm i` (wait for the install to finish before proceeding)

#### You have now finished building My Photo Website.

# Run Instructions
These steps must be repeated each time you wish to start the server.

Run the following commands from the terminal, assuming the current directory is `/My-Photo-Website`:
1. `cd application` (your current directory should now be `/My-Photo-Website/application`)
2. `npm start` (starting the server will take a few seconds)

#### The server is now running. You can go to the website's front page by entering `localhost:3000` into your browser's address bar.
