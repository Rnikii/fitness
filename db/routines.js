const { client } = require("./client");

async function createRoutines({ creatorId, public, name, goal }) {
  try {
    const {
      rows: [routines],
    } = await client.query(
      `
          INSERT INTO routines("creatorId", public, name, goal)  
          VALUES($1, $2, $3, $4) 
           RETURNING *;
        `,
      [creatorId, public, name, goal]
    );

    return routines;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRoutines,
};
