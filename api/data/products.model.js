const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory");

const Product = sequelize.define("product",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        price: DataTypes.STRING,
        mrp: DataTypes.FLOAT,
        stock: DataTypes.INTEGER,
        isPublished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        timestamps: false
    }
);

// Create the table
(async () => {
    try {
        await sequelize.sync();
        console.log("Database and table synced successfully");
    } catch (error) {
        console.error("Error syncing database", error);
    }
})();

module.exports = Product;