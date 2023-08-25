module.exports = (sequelize, DataTypes) => {
    const CustomerDetails = sequelize.define("CustomerDetails", {
       
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        zipcode: {
            type: DataTypes.STRING,
            allowNull: true
        },
       
    }, {
        tableName: 'customer_details',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
    );
    return CustomerDetails;
}