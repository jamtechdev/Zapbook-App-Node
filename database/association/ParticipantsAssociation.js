const { ParticipantStat } = require("../database");

module.exports = (db) => {
    const { User, Participants, CustomerDetails, ParticipantTeams, Overall, Booking, Bookable, Experience, Game, Lane, BookingLane, PageLog,ParticipantStat } = db;

    /**
     * Relation between Participant with Customer details 
     * and Participants with Participant team to fetch the 
     * Participants of game with assigned targets.  
     */
    Participants.hasOne(CustomerDetails, {
        foreignKey: 'user_id',
        sourceKey: 'user_id',
    });
    CustomerDetails.belongsTo(Participants, {
        foreignKey: 'user_id',
        targetKey: 'user_id'
    });

    Participants.hasOne(ParticipantTeams, {
        foreignKey: 'participant_id',
        sourceKey: 'user_id',
    });
    ParticipantTeams.belongsTo(Participants, {
        foreignKey: 'participant_id',
        targetKey: 'user_id'
    });
    /**
     * End
     */

    /**
     * Relation between Overall and User 
     */
    Overall.hasOne(User, {
        foreignKey: 'id',
        sourceKey: 'participants_id'
    });
    User.belongsTo(Overall, {
        foreignKey: 'id',
        targetKey: 'participants_id'
    });

    /**
     * relation Booking and Bookable
     * Bookable can be multiple 
     */
    Booking.belongsToMany(Bookable, {
        through: 'booking_bookable',
        foreignKey: 'booking_id',
        otherKey: 'bookable_id',
        timestamps: false
    });
    Bookable.belongsToMany(Booking, {
        through: 'booking_bookable',
        foreignKey: 'booking_id',
        otherKey: 'bookable_id',
        timestamps: false
    });

    /** 
     * relation between Bookable and Experience
     * 
     */
    Bookable.hasOne(Experience, {
        foreignKey: 'id'
    });
    Experience.belongsTo(Bookable, {
        foreignKey: 'connected_experience'
    });

    /** relation between booking and User 
     * Booking has One user
    */

    Booking.hasOne(User, {
        foreignKey: 'id',
        sourceKey: 'user_id'
    });
    User.belongsTo(Booking, {
        foreignKey: 'id',
        targetKey: 'user_id'
    })

    /**
     * relation between Experience with Game 
     * experience has multiple games.
     */
    Experience.hasMany(Game, {
        foreignKey: 'experience_id'
    });
    Game.belongsTo(Experience, {
        foreignKey: 'experience_id'
    });

    /**
     * relation between Booking and Lane 
     * through booking_lane
     */
    Booking.belongsToMany(Lane, {
        through: 'booking_lane',
        foreignKey: 'booking_id',
        otherKey: 'lane_id',
        timestamps: false,
    });

    Lane.belongsToMany(Booking, {
        through: 'booking_lane',
        foreignKey: 'booking_id',
        otherKey: 'lane_id',
        timestamps: false,
    });

    /**
     * Connect Participants with Overall
     * 
     */
    Participants.hasOne(Overall, {
        foreignKey: 'participants_id',
        sourceKey: 'user_id',
    });

    Overall.belongsTo(Participants, {
        foreignKey: 'participants_id',
        targetKey: 'user_id',
    });
    /**
     * Relation between Booking and pageLogs
     */
    Booking.hasOne(PageLog, {
        foreignKey: 'reservation_id',
        sourceKey: 'reservation_id',
    });

    PageLog.belongsTo(Booking, {
        foreignKey: 'reservation_id',
        sourceKey: 'reservation_id',
    });

    ParticipantTeams.hasMany(ParticipantStat, {
        foreignKey: 'participants_id',
        sourceKey:'participant_id'
    });
    ParticipantStat.belongsTo(ParticipantTeams, {
        foreignKey: 'participants_id',
        targetKey:'participant_id'
    });

};
