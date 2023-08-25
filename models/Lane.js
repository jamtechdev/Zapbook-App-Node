module.exports = (sequelize, DataTypes) => {
    const Lane = sequelize.define("Lane", {
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        tableName: 'lanes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
    );
    return Lane;
}