module.exports = (db) => {
    const { User, Participants, CustomerDetails, ParticipantTeams, Overall, Booking, Bookable, Experience } = db;

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

    Overall.hasOne(User, {
        foreignKey: 'id',
        sourceKey: 'participants_id'
    });
    User.belongsTo(Overall, {
        foreignKey: 'id',
        targetKey: 'participants_id'
    });

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


    Bookable.hasOne(Experience, {
        foreignKey: 'id'
    });
    Experience.belongsTo(Bookable, {
        foreignKey: 'connected_experience'
    })



};
