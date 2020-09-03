module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Serie', {
        encoded: {
            type: DataTypes.STRING(225),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(125),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
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