module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Episode', {
        title: {
            type: DataTypes.STRING(125),
            allowNull: false,
            primaryKey: true
        },
        serie: {
            type: DataTypes.STRING(125),
            allowNull: false,
            primaryKey: true,
            references: {
                // FOREIGN KEY (`serie`) REFERENCES `serie` (`name`))
                model: sequelize.models.Serie,
                key: 'encoded'
            }
        },
        encoded: {
            type: DataTypes.STRING(225),
            primaryKey: true,
            allowNull: false
        },
        link: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isFromYoutube: {
            type: DataTypes.BOOLEAN,
            default: false
        }
    },{
        tableName: 'episode'
    })
}