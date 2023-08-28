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
const Game = db.Game;
const Lane = db.Lane;
const { DateTime } = require('luxon');

/**
 * This will return the game list
 * @param {booking_id, location_id, lane_id} req 
 */
const gameList = async (req) => {
    try {
        const bookings = await Booking.findOne({
            attributes: ['id', 'booking_date', 'start_time', 'end_time', 'reservation_id', 'group_size', 'user_id'],
            include: [
                {
                    model: Bookable,
                    attributes: ['id', 'connected_experience'],
                    include: [
                        {
                            model: Experience,
                            attributes: ['id', 'name'],
                            include: [
                                {
                                    model: Game,
                                    attributes: ['id', 'experience_id', 'name'],
                                },
                            ],
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'role_id'],
                },
                {
                    model: Lane,
                    attributes: ['id', 'name'],
                    where: {
                        id: req.lane_id,
                    },
                },
            ],
            where: {
                location_id: req.location_id,
                booking_date: {
                    [Op.eq]: literal('DATE(NOW())')
                },
                start_time: {
                    [Op.lte]: literal(`CONVERT_TZ(NOW(), '+00:00', '+05:30')`)
                },
                end_time: {
                    [Op.gte]: literal(`CONVERT_TZ(NOW(), '+00:00', '+05:30')`)
                }
            },
        });
        let booking_array = {};
        if (bookings) {
            const games_array = [];
            const lane_array = [];
            for (const games of bookings.Bookables) {
                for (const game of games.Experience.Games) {
                    if (game.id == 3) {
                        const data = await Game.findAll({ where: { experience_id: 2 } });
                        const sub_game_array = [];
                        for (const min_game of data) {
                            if (min_game.id == 6) {
                            }
                            else {
                                sub_game_array.push({
                                    experience_id: min_game.experience_id,
                                    name: min_game.name,
                                    game_id: min_game.game_id,
                                });
                            }
                        }
                        games_array.push({
                            experience_id: game.experience_id,
                            name: game.name,
                            game_id: game.game_id,
                            game_rule: game.game_rule,
                            sub_game: sub_game_array,
                        });
                    } else {
                        games_array.push({
                            experience_id: game.experience_id,
                            name: game.name,
                            game_id: game.game_id,
                        });
                    }
                }
            }
            booking_array = {
                booking_id: bookings.id,
                booking_date: bookings.booking_date,
                start_time: bookings.start_time,
                end_time: bookings.end_time,
                reservation_id: bookings.reservation_id,
                group_size: bookings.group_size,
                games: games_array,
                lane: lane_array,
                user_name: bookings.User.name,
            };
        }
        // console.log(booking_array);
        return booking_array;
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
                    model: ParticipantTeams,
                },
                {
                    model: Overall,
                }
            ]
        });
        const participants = participants_array.map(participant => {
            return {
                reservation_id: booking.reservation_id,
                booking_id: participant.booking_id,
                user_id: participant.CustomerDetail.user_id,
                participant_name: participant.CustomerDetail.first_name + ' ' + participant.CustomerDetail.last_name,
                target_side: participant.ParticipantTeam ? participant.ParticipantTeam.dataValues.target : "",
                throws: participant.Overall ? participant.Overall.nu_of_throws : 0,
                score: participant.Overall ? participant.Overall.total_score : 0,
            };
        });
        // console.log(participants_array)
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
            console.log(stat_calc.throws);
            if (stat_calc.throws == 0) {
                message = "Insufficient Throws!";
                return {
                    status: false,
                    message: message
                }
            }
            else {
                const result = await Overall.update({
                    nu_of_throws: stat_calc.nu_of_throws + 1,
                    total_miss: (req.status == 'miss') ? stat_calc.total_miss + 1 : 0,
                    total_hits: (req.status == 'hit') ? stat_calc.total_hits + 1 : 0,
                    total_score: stat_calc.total_score + score_points,
                    throws: stat_calc.throws > 0 ? stat_calc.throws - 1 : 0,
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



