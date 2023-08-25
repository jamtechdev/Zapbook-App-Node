const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    logging: false,
    dialect: "mysql",
  }
);
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

/*  Define your models */
db.User = require("../models/User")(sequelize, DataTypes);
db.Booking = require("../models/Booking")(sequelize, DataTypes);
db.Bookable = require("../models/Bookable")(sequelize, DataTypes);
db.Lane = require("../models/Lane")(sequelize, DataTypes);



db.Participants = require("../models/Participants")(sequelize, DataTypes);
db.ParticipantTeams = require("../models/ParticipantTeams")(sequelize, DataTypes);
db.CustomerDetails = require("../models/CustomerDetails")(sequelize, DataTypes);
db.Overall = require("../models/Overall")(sequelize, DataTypes);

/* Association or Relation between tables  */
const ParticipantsAssociation = require('./association/ParticipantsAssociation');
// // const productAssociations = require('./association/Product');
ParticipantsAssociation(db);
// productAssociations(db);
// Define associations

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });

  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
})();
module.exports = db;