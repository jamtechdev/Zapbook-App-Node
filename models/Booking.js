module.exports = (sequalize, DataTypes) => {
    const Booking = sequalize.define("Booking", {
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        reservation_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        group_size: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        booking_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        tax_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        tip_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        upgrade_count: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        upgrade_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deposit: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        paid_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        total_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        special_request: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        special_event: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        from_where: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        origin_sale: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        invoice_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        waiver_link: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        no_of_lanes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        no_of_participants: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        no_of_spectators: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        welcome_message: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cancellation_policy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        terms_of_service: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ip_address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        region_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },


    }, {
        tableName: 'bookings',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return Booking;
}