const db = require('../../database/database');
const { Op, literal } = require('sequelize');
const ParticipantStat = db.ParticipantStat;
const Booking = db.Booking;
const Bookable = db.Bookable;
const GameScore = db.GameScore
const User = db.User;
const Overall = db.Overall;
const Participants = db.Participants;
const CustomerDetails = db.CustomerDetails;
const ParticipantTeams = db.ParticipantTeams;
const Experience = db.Experience;
const { DateTime } = require('luxon');

/**
 * This will return the game list
 * @param {booking_id, location_id, lane_id} req 
 */
const gameList = async (req) => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const currentDateTime = DateTime.now();
        const start_time = currentDateTime.toFormat('yyyy-MM-dd HH:mm:ss');
        console.log(start_time);
        const bookings = await Booking.findOne({
            attributes: ['id', 'booking_date', 'start_time', 'end_time', 'reservation_id', 'group_size', 'user_id'],
            include: {
                model: Bookable,
                attributes: ['id', 'connected_experience'],
                include: [
                    {
                        model: Experience,
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: Game,
                                attributes: ['id', 'name'],
                            }
                        ]
                    }
                ]
            },

            where: {
                location_id: req.location_id,
                booking_date: {
                    [Op.eq]: literal('DATE(NOW())')
                },
                start_time: {
                    [Op.lte]: start_time
                },
                end_time: {
                    [Op.gte]: start_time
                }
            },

        });

        // console.log(bookings);
        return bookings;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
}
/**
 * This will return all the participant list
 * @param {booking_id} req 
 * @returns 
 */
const participantsList = async (req) => {
    try {


        const booking = await Booking.findOne({ where: { id: req.booking_id } });
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
        const participants = participants_array.map(participant => {
            return {
                reservation_id: booking.reservation_id,
                booking_id: participant.booking_id,
                user_id: participant.CustomerDetail.user_id,
                participant_name: participant.CustomerDetail.first_name + ' ' + participant.CustomerDetail.last_name,
                target_side: participant.ParticipantTeam ? participant.ParticipantTeam.dataValues.target : ""
            };
        });
        return participants;
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }
}
/**
 * this will assign target to participants 
 * @param {booking_id,participant_id,target} req 
 * @returns 
 */
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
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }
}
/**
 * This will return all the participants first one will be winner.
 * @param {booking_id} req 
 * @returns 
 */
const winnerList = async (req) => {
    try {
        const winner_array = await Overall.findAll({
            where: {
                booking_id: req.booking_id
            },
            include: {
                model: User
            }
        });
        const winners = winner_array.map((winner, index) => {
            return {
                id: winner.id,
                participants_id: winner.participants_id,
                name: winner.User.name,
                email: winner.User.email,
                total_score: winner.total_score,
                status: index == 0 ? "Winner !!" : 'Looser!',
                nu_of_throws: winner.nu_of_throws,
                total_hits: winner.total_hits,
                total_miss: winner.total_miss,
                booking_id: winner.booking_id,
            }
        })
        return winners
    } catch (error) {
        console.error('Error in Fetching winners:', error);
        throw error;
    }
}
/**
 * this will be used at the time of playing game .
 * @param {booking_id,participant_id,status,game_id,score} req 
 * @returns 
 */
const playing = async (req) => {
    try {
        if (req.status == 'hit') {
            const game_score = await GameScore.findOne({
                where: {
                    part_name: req.score,
                    game_id: req.game_id
                }
            });
            score_points = game_score.points ? game_score.points : 0;
        }
        else {
            score_points = 0;
        }
        const participant_stat_data = {
            booking_id: req.booking_id,
            participants_id: req.participant_id,
            status: req.status,
            score: score_points,
        }
        await ParticipantStat.create(participant_stat_data);
        const stat_calc = await Overall.findOne({
            where: {
                booking_id: req.booking_id,
                participants_id: req.participant_id,
            },
        });
        if (stat_calc) {
            const result = await Overall.update({
                nu_of_throws: stat_calc.nu_of_throws + 1,
                total_miss: (req.status == 'miss') ? stat_calc.total_miss + 1 : 0,
                total_hits: (req.status == 'hit') ? stat_calc.total_hits + 1 : 0,
                total_score: stat_calc.total_score + score_points,
            }, {
                where: {
                    booking_id: req.booking_id,
                    participants_id: req.participant_id,
                }
            })
            message = "Updated Successfully!";
            return {
                status: true,
                message: message
            }
        }
        else {
            const data = {
                booking_id: req.booking_id,
                participants_id: req.participant_id,
                nu_of_throws: 1,
                total_miss: (req.status == 'miss') ? 1 : 0,
                total_hits: (req.status == 'hit') ? 1 : 0,
                total_score: score_points,
            }
            await Overall.create(data);
            message = "Saved Successfully!";
            return {
                status: true,
                message: message
            }
        }
    } catch (error) {
        console.error('Error in saving game data:', error);
        throw error;
    }
}
module.exports = { gameList, participantsList, assignTarget, winnerList, playing }