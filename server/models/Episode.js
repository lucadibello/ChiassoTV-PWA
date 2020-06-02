const Sequelize = require('sequelize');

// Conect to DB
const sequelize = new Sequelize('chiassotv', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

const Model = Sequelize.Model;
class Episode extends Model {}

Episode.init(
    {
        episode_number: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        link: {
            type: Sequelize.STRING(128),
            allowNull: false
        },
        title: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        description: {
            type: Sequelize.STRING(1028),
        },
        created_by: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        created_on: {
            type: Sequelize.DATE(6),
            allowNull: false
        }
    },
    {
        sequelize: sequelize,
        tableName: 'episode'
    }
);

module.exports = Episode