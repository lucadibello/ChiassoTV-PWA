module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Serie', {
        name: {
            type: DataTypes.STRING(255),
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