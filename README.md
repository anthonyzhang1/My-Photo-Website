# My Photo Website, a photo sharing website
My Photo Website is a photo sharing website similar to Imgur, but with fewer features.\
You can register for an account, view other people's photos, upload your own photos, and comment on photos.\
You may also search for photos with a matching title or description.

This application uses MySQL, Express, and Handlebars. MySQL is the database, Express is the backend, and Handlebars is used for the frontend.\
You will need MySQL and NodeJS to run the server.

This application was made in my university's Web Development course, with a few changes made to the application since then.

#### Note: This application should only be locally hosted because it was not designed entirely with security in mind. This is more a project for learning.

# Installation Instructions
You only need to complete the installation process once.

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

#### The server is now running. You can go to the website's front page by entering `localhost:3000` into your browser's address bar.

# Screenshots of the Application
The front page, which shows the most recently uploaded photos:

![front page](https://github.com/anthonyzhang1/My-Photo-Website/blob/main/.github/front%20page%20posts.png)

A photo's page, which shows the photo's title, description, uploader, comments, etc.:

![post page](https://github.com/anthonyzhang1/My-Photo-Website/blob/main/.github/yuan%20shao%20post.png)

Search results for all photos which contain the phrase "Atelier" in its title or description:

![atelier search](https://github.com/anthonyzhang1/My-Photo-Website/blob/main/.github/atelier%20search.png)
