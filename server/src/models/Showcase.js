module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Showcase', {
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
        episode: {
            type: DataTypes.STRING(225),
            primaryKey: true,
            onDelete: 'cascade',
            onUpdate: 'cascade',
            references: {
                // FOREIGN KEY (`serie`) REFERENCES `serie` (`encoded`))
                model: sequelize.models.Episode,
                key: 'encoded'
            }
        },
    },{
        tableName: 'showcase'
    })
}