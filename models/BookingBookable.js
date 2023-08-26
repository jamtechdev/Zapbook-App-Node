module.exports = (sequelize, DataTypes) => {
    const BookingBookable = sequelize.define("BookingBookable", {
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bookable_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        is_override: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        override_price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        is_discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        discount_percent: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        }
    }, {
        tableName: 'booking_bookable',
    });
    return BookingBookable;
}