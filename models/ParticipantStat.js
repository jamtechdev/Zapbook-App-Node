module.exports = (sequalize, DataTypes) => {
    const ParticipantStat = sequalize.define("ParticipantStat", {
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        participants_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM,
            values: ['empty', 'hit', 'miss'],
            allowNull: true,
        },
    }, {
        tableName: 'participant_stats',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return ParticipantStat;
}