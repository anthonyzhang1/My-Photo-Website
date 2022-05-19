const mysql = require("mysql2/promise");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });

function displayWarningMessage(warning) {
  switch (warning.Code) {
    case 1007:
      console.log(`Skipping Database Creation. ${warning.Message}`);
      break;
    case 1050:
      console.log(`Skipping Table Creation. ${warning.Message}`);
      break;
  }
}

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });
}

async function makeDatabase(connection) {
  const [result, _] = await connection.query("CREATE DATABASE IF NOT EXISTS my_photo_website;");

  if (result && result.warningStatus > 0) {
    const [warningResult, _] = await connection.query("SHOW WARNINGS");
    displayWarningMessage(warningResult[0]);
  } else console.log("Created Database my_photo_website!");
}

async function makeUsersTable(connection) {
  const [result, _] = await connection.query(
    `CREATE TABLE IF NOT EXISTS my_photo_website.users (
      id INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(128) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      active INT NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL,
      PRIMARY KEY (id),
      UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
      UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE,
      UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE)
    ENGINE = InnoDB;`
  );

  if (result && result.warningStatus > 0) {
    const [warningResult, _] = await connection.query("SHOW WARNINGS");
    displayWarningMessage(warningResult[0]);
  } else console.log("Created Users Table!");
}

async function makePostsTable(connection) {
  const [result, _] = await connection.query(
    `CREATE TABLE IF NOT EXISTS my_photo_website.posts (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(128) NOT NULL,
      description MEDIUMTEXT NOT NULL,
      photo_path VARCHAR(2048) NOT NULL,
      thumbnail VARCHAR(2048) NOT NULL,
      active INT NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL,
      fk_user_id INT NOT NULL,
      PRIMARY KEY (id),
      UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
      INDEX post_author_idx (fk_user_id ASC) VISIBLE,
      CONSTRAINT post_author
        FOREIGN KEY (fk_user_id)
        REFERENCES my_photo_website.users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
    ENGINE = InnoDB;`
  );

  if (result && result.warningStatus > 0) {
    const [warningResult, _] = await connection.query("SHOW WARNINGS");
    displayWarningMessage(warningResult[0]);
  } else console.log("Created Posts Table!");
}

async function makeCommentsTable(connection) {
  const [result, _] = await connection.query(
    `CREATE TABLE IF NOT EXISTS my_photo_website.comments (
      id INT NOT NULL AUTO_INCREMENT,
      comment MEDIUMTEXT NOT NULL,
      fk_post_id INT NOT NULL,
      fk_author_id INT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT now(),
      PRIMARY KEY (id),
      UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
      INDEX comment_author_idx (fk_author_id ASC) VISIBLE,
      INDEX comment_belongs_to_idx (fk_post_id ASC) VISIBLE,
      CONSTRAINT comment_author
        FOREIGN KEY (fk_author_id)
        REFERENCES my_photo_website.users (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      CONSTRAINT comment_belongs_to
        FOREIGN KEY (fk_post_id)
        REFERENCES my_photo_website.posts (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION)
    ENGINE = InnoDB;`
  );

  if (result && result.warningStatus > 0) {
    const [warningResult, _] = await connection.query("SHOW WARNINGS");
    displayWarningMessage(warningResult[0]);
  } else console.log("Created Comments Table!");
}

(async function main() {
  let connection = null;

  try {
    connection = await getConnection();
    await makeDatabase(connection); // make DB
    await connection.query("USE my_photo_website"); // set new DB to the current DB
    await makeUsersTable(connection); // try to make users table
    await makePostsTable(connection); // try to make posts table
    await makeCommentsTable(connection); // try to make comments table
    await connection.end();
  } catch (error) {
    console.error(error);
    if (connection != null) connection.close();
  }
})();