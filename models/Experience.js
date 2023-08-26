module.exports = (sequelize, DataTypes) => {
    const Experience = sequelize.define("Experience", {
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_master: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        size: {
            type: DataTypes.ENUM,
            values: ['large', 'mini'],
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM,
            values: ['axe_throwing', 'ice_curling', 'shuffleboard'],
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

    }, {
        tableName: 'experiences',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
    return Experience;
}