const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
    sequelize.define('product', {
    idProduct:{
        type: DataTypes.UUID,
        primaryKey:true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    brand:{
        type: DataTypes.STRING,
        // allowNull:false
    },
    price:{
        type: DataTypes.FLOAT,
        // allowNull:false
    },
    stock:{
        type:DataTypes.INTEGER,
        // allowNull:false
    },
    sold_quantity:{
        type:DataTypes.INTEGER,
        // allowNull:false
    },
    condition:{
        type:DataTypes.ENUM("new","used"),
        // allowNull:false
    },
    image:{
        type:DataTypes.ARRAY(DataTypes.STRING),
        // allowNull:false
    },
    thumbnail:{
        type:DataTypes.STRING,
        // allowNull:false
    },
    attributes:{
        type: DataTypes.JSON,
        // allowNull: false
    },
    });
};