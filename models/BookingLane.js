module.exports = (sequelize,DataTypes)=>{
    const BookingLane = sequelize.define("",{
        booking_id:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
        lane_id:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
    })
}