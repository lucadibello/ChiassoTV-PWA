module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Advertisement', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        client_email: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        client_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        client_surname: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        client_phoneNumber: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        img: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        website_link: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },{
        tableName: 'advertisement'
    })
}