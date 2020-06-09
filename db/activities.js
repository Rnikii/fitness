const { client } = require("./client");

async function createActivities({ name, description }) {
  try {
    await client.query(
      `
          INSERT INTO activities( name, description) 
          VALUES($1, $2) 
          RETURNING *;
        `,
      [name, description]
    );
  } catch (error) {
    throw error;
  }
}
module.exports = {
  createActivities,
};
