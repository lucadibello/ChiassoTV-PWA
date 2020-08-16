module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        username: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
    },{
        tableName: 'user'
    })
}