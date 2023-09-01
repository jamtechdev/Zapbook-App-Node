module.exports = (sequalize,Datatypes)=>{
    const LocationBusinessHours = sequalize.define("LocationBusinessHours",{
        location_id:{
            type:Datatypes.INTEGER,
            allowNull:true,
        },
        title:{
            type:Datatypes.STRING,
            allowNull:true,
        },
        day:{
            type:Datatypes.STRING,
            allowNull:true,
        },
        start_time:{
            type:Datatypes.STRING,
            allowNull:true,
        },
        end_time:{
            type:Datatypes.STRING,
            allowNull:true,
        },
    },{
        tableName:'location_business_hours',
        timestamps:false,
       
    });

    return LocationBusinessHours;
}