module.exports = (sequelize, DataTypes) => {
    const GameScore = sequelize.define("", {
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        part_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        tableName: 'game_scores',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return GameScore;
}