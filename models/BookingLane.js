module.exports = (sequelize,DataTypes)=>{
    const BookingLane = sequelize.define("BookingLane",{
        booking_id:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
        lane_id:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
        game_started:{
            type:DataTypes.DATE,
            allowNull:true,
        },
    },{
        timestamps: false,
        tableName: 'booking_lane',
    });
    return BookingLane;
}