const { client } = require("./client");

async function createRoutineActivities({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    await client.query(
      `
          INSERT INTO routine_activities( "routineId", "activityId", count, duration) 
          VALUES($1, $2, $3, $4) 
          RETURNING *;
        `,
      [routineId, activityId, count, duration]
    );
  } catch (error) {
    throw error;
  }
}
module.exports = {
  createRoutineActivities,
};
