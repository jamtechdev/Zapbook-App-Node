module.exports = (sequelize, DataTypes) => {
    const Overall = sequelize.define("Overall", {
        participants_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        nu_of_throws: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        total_miss: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        total_hits: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        total_score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        tableName: 'overalls',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
    );
    return Overall;
}