module.exports = (sequelize, Datatypes) => {
    const Game = sequelize.define("Game", {
        experience_id: {
            type: Datatypes.INTEGER,
            allowNull: true,
        },
        name: {
            type: Datatypes.STRING,
            allowNull: true,
        },
        exculde_game_id: {
            type: Datatypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: Datatypes.INTEGER,
            allowNull: true,
        },
        game_id: {
            type: Datatypes.VIRTUAL,
            get() {
                return `${this.id}`;
            },
        }

    }, {
        tableName: 'games',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return Game;
}