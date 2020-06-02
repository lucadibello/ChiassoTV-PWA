module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Episode', {
        episode_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        link: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(1028),
        },
        created_by: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        created_on: {
            type: DataTypes.DATE(6),
            allowNull: false
        }
    })
}