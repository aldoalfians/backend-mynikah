import {Sequelize} from "sequelize";

const db = new Sequelize('mynikah_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;
