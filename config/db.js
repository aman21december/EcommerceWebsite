const Sequelize = require("sequelize");
const { createNamespace } = require("cls-hooked");

const cls = createNamespace("transaction-namespace"); // any string
Sequelize.useCLS(cls);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialectOptions: {
            multipleStatements: true,
            decimalNumbers: true
        },
        dialect: "mysql",
        timezone: "+05:30",
        host: process.env.DB_HOST,
        define: {
            //prevent sequelize from pluralizing table names
            freezeTableName: true,
        },
        logging: false
    },
    {
        pool: {
            max: 1000,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

module.exports = sequelize;
