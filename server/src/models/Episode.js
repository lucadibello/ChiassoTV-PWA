module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Episode', {
        title: {
            type: DataTypes.STRING(125),
            allowNull: false,
            primaryKey: true
        },
        serie: {
            type: DataTypes.STRING(225),
            primaryKey: true,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            references: {
                // FOREIGN KEY (`serie`) REFERENCES `serie` (`encoded`))
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
        thumbnail: {
            type: DataTypes.STRING(128),
            allowNull: true,
            default: null
        },
        isFromYoutube: {
            type: DataTypes.BOOLEAN,
            default: false
        }
    },{
        tableName: 'episode'
    })
    
}