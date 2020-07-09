module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Serie', {
        name: {
            type: DataTypes.STRING(125),
            allowNull: false,
            primaryKey: true
        },
        encoded: {
            type: DataTypes.STRING(225),
            allowNull: false,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        banner: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        tableName: 'serie'
    })
}