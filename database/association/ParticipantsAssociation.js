module.exports = (db) => {
    const { Participants, CustomerDetails, ParticipantTeams } = db;


    Participants.hasOne(CustomerDetails, {
        foreignKey: 'user_id',
        sourceKey: 'user_id', // The source key in Participants table
        // Alias for the association
    });
    Participants.hasOne(ParticipantTeams, {
        foreignKey: 'participant_id',
        sourceKey: 'user_id',
    });

    CustomerDetails.belongsTo(Participants, {
        foreignKey: 'user_id',
        targetKey: 'user_id' // The target key in CustomerDetails table
    });
    ParticipantTeams.belongsTo(Participants, {
        foreignKey: 'participant_id',
        targetKey: 'user_id'
    });

};
/**
 * public function customer_info() {
        return $this->belongsTo(CustomerDetail::class, 'user_id', 'user_id');
    }

    public function targets(){
        return $this->hasOne(ParticipantTeam::class, 'participant_id', 'user_id');
    }
     Participants.hasOne(CustomerDetails, {
        foreignKey: 'user_id',
    });

    CustomerDetails.belongsTo(Participants, {
        foreignKey: 'user_id',
    });
 */