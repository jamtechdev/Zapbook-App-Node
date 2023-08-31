module.exports = (sequelize, DataTypes) => {
    const ParticipantTeam = sequelize.define("ParticipantTeam", {
        participant_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        target: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status:{
            type:DataTypes.INTEGER,
            allowNull:true,
        }

    }, {
        tableName: 'participant_teams',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
    );
    return ParticipantTeam;
}