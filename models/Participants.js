module.exports = (sequelize, DataTypes) => {
    const Participants = sequelize.define("Participants", {
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull:true
        },
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        lane_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        is_minor: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        currently_live: {
            type: DataTypes.STRING,
            allowNull: true
        },
        receive_update: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        signature: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        signed_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        tableName: 'participants',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
    );

    Participants.associate = (models) => {
        Participants.hasOne(models.CustomerDetails, {
            foreignKey: 'user_id',
            sourceKey: 'user_id' // Explicitly specify the source key
        });
    };

    return Participants;
}