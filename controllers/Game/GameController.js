const db = require('../../database/database');
const Booking = db.Booking;
const Bookable = db.Bookable;
const Lane = db.Lane;
const Overall = db.Overall;
const Participants = db.Participants;
const CustomerDetails = db.CustomerDetails;
const ParticipantTeams = db.ParticipantTeams;
const participants_list = async (req) => {

    try {
        const booking = await Booking.findOne({ where: { id: req.booking_id } });
        // console.log(booking);
        var participants_array = await Participants.findAll({
            where: {
                booking_id: req.booking_id
            },
            include: [
                {
                    model: CustomerDetails,
                },
                {
                    model: ParticipantTeams
                }
            ]
        });
        const processedData = participants_array.map(participant => {
            return {
                reservation_id: booking.reservation_id,
                booking_id: participant.booking_id,
                user_id: participant.CustomerDetail.user_id,
                participant_name: participant.CustomerDetail.first_name + ' ' + participant.CustomerDetail.last_name,
                target_side: participant.ParticipantTeam ? participant.ParticipantTeam.dataValues.target : ""
            };
        });
        return processedData;
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }
}

const assignTarget = async (req) => {
    try {
        var message = "";
        const records = await ParticipantTeams.findOne({
            where: {
                booking_id: req.booking_id,
                participant_id: req.participants_id,
            },

        });

        if (records) {
            // If user exists, update their username
            const participantsUpdate = await ParticipantTeams.update({
                booking_id: req.booking_id,
                participant_id: req.participants_id,
                target: req.target

            }, {
                where: {
                    booking_id: req.booking_id,
                    participant_id: req.participants_id,
                }
            }
            );
            message = "Participants updated on Targets";
            return {
                status: true,
                message: message
            }

        }
        else {
            const participantsUpdate = await ParticipantTeams.create({
                booking_id: req.booking_id,
                participant_id: req.participants_id,
                target: req.target

            });
            message = "Participants assigned on Targets";
            return {
                status: true,
                message: message
            }
        }

        //  return user;

    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }
}

module.exports = { participants_list, assignTarget }