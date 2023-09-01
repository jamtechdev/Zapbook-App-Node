module.exports = (sequelize, DataTypes) => {
    const Participants = sequelize.define("Participants", {
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: true
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
            type: DataTypes.ENUM,
            values: ['participant', 'spectator'],
            allowNull: true
        },
        playing_order: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        throws: {
            type: DataTypes.VIRTUAL,
            async get() {
                const [result] = await sequelize.query(`
                    SELECT nu_of_throws
                    FROM overalls
                    WHERE booking_id = '${this.booking_id}' AND participants_id = '${this.user_id}'
                `, { type: sequelize.QueryTypes.SELECT });
                if (result) {
                    return result;
                }
                return 12;
            },
        },
        scores: {
            type: DataTypes.VIRTUAL,
            async get() {
                const [result] = await sequelize.query(`
                    SELECT total_score
                    FROM overalls
                    WHERE booking_id = '${this.booking_id}' AND participants_id = '${this.user_id}'
                `, { type: sequelize.QueryTypes.SELECT });
                if (result) {
                    return result ? result : 0;
                }

            },
        },
    }, {
        tableName: 'participants',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
    );
    return Participants;
}