const {
  createUser,
  createActivities,
  createRoutines,
  createRoutineActivities,
} = require("./");

const { client } = require("./client");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    // have to make sure to drop in correct order
    await client.query(`
    DROP TABLE IF EXISTS routine_activities;
    DROP TABLE IF EXISTS routines;
    DROP TABLE IF EXISTS activities;
      DROP TABLE IF EXISTS users;
      
    `);

    // DROP TABLE IF EXISTS routine_activities;
    //   DROP TABLE IF EXISTS routines;

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("create tables");
    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
    );
     CREATE TABLE activities (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) UNIQUE NOT NULL,
     description TEXT NOT NULL
 );
 CREATE TABLE routines (
  id SERIAL PRIMARY KEY,
  "creatorId" INTEGER REFERENCES users(id),
  public BOOLEAN DEFAULT false,
  name VARCHAR(255) UNIQUE NOT NULL,
  goal TEXT NOT NULL
);
CREATE TABLE routine_activities (
  id SERIAL PRIMARY KEY,
  "routineId" INTEGER REFERENCES routines(id),
  "activityId" INTEGER REFERENCES activities(id),
  duration INTEGER,
  count INTEGER,
  UNIQUE("routineId" , "activityId")
)
        `);
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({
      username: "albert",
      password: "bertie99",
    });
    await createUser({
      username: "sandra",
      password: "2sandy4me",
    });
    await createUser({
      username: "glamgal",
      password: "soglam",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialActivities() {
  try {
    console.log("Starting to create activities...");

    await createActivities({
      name: "biking",
      description: "you bike",
    });
    await createActivities({
      name: "running",
      description: "you run",
    });
    await createActivities({
      name: "tennis",
      description: "play tennis",
    });

    console.log("Finished creating activities!");
  } catch (error) {
    console.error("Error creating activities!");
    throw error;
  }
}

async function createInitialRoutines() {
  try {
    console.log("Starting to create routines...");

    await createRoutines({
      creatorId: "1",
      public: true,
      name: "Routine-1",
      goal: "Burn thanksgiving food calories",
    });
    await createRoutines({
      creatorId: "2",
      public: true,
      name: "National Donut Day",
      goal: "Eat body weight in donuts",
    });
    await createRoutines({
      creatorId: "3",
      public: false,
      name: "quarentin-routine",
      goal: "Eat Code Repeat",
    });

    console.log("Finished creating routines!");
  } catch (error) {
    console.error("Error creating routines!");
    throw error;
  }
}

async function createInitialRoutineActivities() {
  try {
    console.log("Starting to create routine_activities...");

    await createRoutineActivities({
      routineId: 1,
      activityId: 1,
      duration: 30,
      count: 1,
    });
    await createRoutineActivities({
      routineId: 2,
      activityId: 1,
      duration: 50,
      count: 30,
    });
    await createRoutineActivities({
      routineId: 3,
      activityId: 2,
      duration: 30,
      count: 10,
    });

    console.log("Finished creating routine_activities!");
  } catch (error) {
    console.error("Error creating routine_activities!");
    throw error;
  }
}

//CHANGE THIS FROM POSTS TO WORKOUTS ?

// async function createInitialPosts() {
//   try {
//     const [albert, sandra, glamgal] = await getAllUsers();

//     console.log("Starting to create posts...");
//     await createPost({
//       authorId: albert.id,
//       title: "First Post",
//       content:
//         "This is my first post. I hope I love writing blogs as much as I love writing them.",
//       tags: ["#happy", "#youcandoanything"],
//     });

//     await createPost({
//       authorId: sandra.id,
//       title: "How does this work?",
//       content: "Seriously, does this even do anything?",
//       tags: ["#happy", "#worst-day-ever"],
//     });

//     await createPost({
//       authorId: glamgal.id,
//       title: "Living the Glam Life",
//       content: "Do you even? I swear that half of you are posing.",
//       tags: ["#happy", "#youcandoanything", "#canmandoeverything"],
//     });
//     console.log("Finished creating posts!");
//   } catch (error) {
//     console.log("Error creating posts!");
//     throw error;
//   }
// }

async function testDB() {
  try {
    const { rows } = await client.query(`SELECT * FROM users;`);
    console.log(rows);
    const { rows: activities } = await client.query(
      `SELECT * FROM activities;`
    );
    console.log(activities);
    const { rows: routines } = await client.query(`SELECT * FROM routines;`);
    console.log(routines);
    const { rows: routine_activities } = await client.query(
      `SELECT * FROM routine_activities;`
    );
    console.log(routine_activities);
  } catch (error) {
    console.error(error);
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialActivities();
    await createInitialRoutines();
    await createInitialRoutineActivities();
  } catch (error) {
    console.log("Error during rebuildDB");
    console.error(error);
    throw error;
  }
}

//keep at the end
rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
