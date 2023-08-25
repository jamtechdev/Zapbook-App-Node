module.exports = (sequelize, DataTypes) => {
    const Bookable = sequelize.define("Bookable", {
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        item_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        display_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sku: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        item_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        unlimited_participants: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        min_participants: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        max_participants: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        reference_video_link: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        per_person_or_total: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        unlimited_stock: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        stock_per_day: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        staff_reliant: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        staff_from_booking: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        staff_to_booking: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lane_schedule: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        experience_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        game_connection: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        connected_experience: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        affected_lanes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        lanes_from_participant: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lanes_to_participant: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        web_booking_widget: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        available_add_ons: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        product_add_ons: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        booking_cutoff: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        how_far_in_advance: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_deposit: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        deposit: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
    },
        {
            tableName: 'bookables',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
    return Bookable;
}