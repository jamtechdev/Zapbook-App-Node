module.exports = (sequalize,DataTypes)=>{
    const PageLog = sequalize.define("PageLog",{
        location_id:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
        lane_id:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
        page:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        reservation_id:{
            type:DataTypes.STRING,
            allowNull:true,
        },

    },{
        tableName: 'page_logs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return PageLog;

}