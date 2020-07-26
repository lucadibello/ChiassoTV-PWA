module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Episode', {
        encoded: {
            type: DataTypes.STRING(225),
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(125),
            allowNull: false,
            unique: true
        },
        serie: {
            type: DataTypes.STRING(225),
            onDelete: 'cascade',
            onUpdate: 'cascade',
            references: {
                // FOREIGN KEY (`serie`) REFERENCES `serie` (`encoded`))
                model: sequelize.models.Serie,
                key: 'encoded'
            }
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