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
const PageLog = db.PageLog;
const BookingLane = db.BookingLane;
const LocationBusinessHours = db.LocationBusinessHours;
const { DateTime } = require('luxon');
var moment = require('moment-timezone');
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
                {
                    model: PageLog
                }
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
                pageLog: bookings.PageLog,
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
                booking_id: req.booking_id,
                status: 'participant'
            },
            include: [
                {
                    model: CustomerDetails,
                },
                {
                    model: ParticipantTeams,
                    where: {
                        booking_id: req.booking_id,
                    }
                },
              
            ]
        });
        const participants = await Promise.all(participants_array.map(async (participant) => {
            const throws = await participant.get('throws');
            const scores = await participant.get('scores');
            return {
                  reservation_id: booking.reservation_id,
                booking_id: participant.booking_id,
                user_id: participant.CustomerDetail.user_id,
                participant_name: participant.CustomerDetail.first_name + ' ' + participant.CustomerDetail.last_name,
                first_name: participant.CustomerDetail.first_name,
                last_name: participant.CustomerDetail.last_name,
                target_side: participant.ParticipantTeam ? participant.ParticipantTeam.dataValues.target : "",
                throws:throws.nu_of_throws,
                scores:scores?.total_score ?? 0,
                
            };
        }));
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
            if (stat_calc.throws == stat_calc.nu_of_throws) {
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
                    total_score: stat_calc.total_score + score_points
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
/**
 * 
 * @param {location_id,lane_id,page,reservation_id} req 
 * @returns 
 */
const pageLog = async (req) => {
    var message = "";
    const records = await PageLog.findOne({
        where: {
            lane_id: req.lane_id,
            reservation_id: req.reservation_id
        },
    });
    if (records) {
        const pageLog = await PageLog.update(req, {
            where: {
                lane_id: req.lane_id,
                reservation_id: req.reservation_id
            }
        }
        );
        message = "Logs saved successfully";
        return {
            status: true,
            message: message
        }
    }
    else {
        const pagelog = await PageLog.create(req);
        message = "Unable to save log!";
        return {
            status: true,
            message: message
        }
    }
}
/**
 * This socket is used to update the game start time in booking_lane table
 * @param {boooking_id,lane_id,timezone} req 
 * @returns 
 */
const gameStarted = async (req) => {
    try {
        const booking = await Booking.findOne({
            where: {
                id: req.booking_id,
            }
        })
        const bookingLane = await BookingLane.findOne({
            where: {
                booking_id: req.booking_id,
                lane_id: req.lane_id
            }
        })
        const date_time = moment().tz(req.timezone).format('YYYY-MM-DD HH:mm:ss');
        if (bookingLane && !bookingLane.game_started) {
            const result = await BookingLane.update({
                game_started: date_time,
                lane_id: req.lane_id,
                booking_id: req.booking_id
            }, {
                where: {
                    lane_id: req.lane_id,
                    booking_id: req.booking_id,
                }
            });
        }
        const endTimestamp = moment(booking.end_time).unix();
        const duration = endTimestamp - moment(date_time).unix();
        return { duration: duration };
    } catch (error) {
        console.error('Error in updating game started:', error);
        throw error;
    }
}
/**
 * This socket is used to update the booking end time 
 * @param {*} req 
 * @returns 
 */
const updateGameTime = async (req) => {
    try {
        const booking = await Booking.findOne({
            where: {
                id: req.booking_id,
            }
        })
        const new_end_time = moment(booking.end_time).add(req.minutes, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        const result = await Booking.update({
            end_time: new_end_time
        }, {
            where: {
                id: req.booking_id,
            }
        });
        const endTimestamp = moment(new_end_time).unix();
        const duration = endTimestamp - moment(moment().tz(req.timezone).format('YYYY-MM-DD HH:mm:ss')).unix();
        return { duration: duration };
    } catch (error) {
        console.error('Error in updating game started:', error);
        throw error;
    }
}
/**
 * This socket is used to undo the last throws
 * @param {participant_id,booking_id} req 
 * @returns 
 */
const undoThrows = async (req) => {
    try {
        if (req.status == 'undo') {
            const participantStats = await ParticipantStat.findOne({
                where: {
                    participants_id: req.participant_id,
                    booking_id: req.booking_id,
                },
                order: [
                    ['id', 'DESC'],
                ],
            });
            const overall_data = await Overall.findOne({
                where: {
                    participants_id: req.participant_id,
                    booking_id: req.booking_id,
                },
            });
            const result = await Overall.update({
                nu_of_throws: overall_data.nu_of_throws > 0 ? overall_data.nu_of_throws - 1 : 0,
                total_miss: (participantStats.status == 'miss' && overall_data.total_miss != 0) ? overall_data.total_miss - 1 : 0,
                total_hits: (participantStats.status == 'hit' && overall_data.total_hits != 0) ? overall_data.total_hits - 1 : 0,
                total_score: overall_data.nu_of_throws > 0 ? overall_data.total_score - participantStats.score : 0,
            }, {
                where: {
                    booking_id: req.booking_id,
                    participants_id: req.participant_id,
                }
            })
            if (result) {
                await ParticipantStat.destroy({ where: { id: participantStats.id } });
                message = "Updated Successfully!";
                return {
                    status: true,
                    message: message
                }
            }
            else {
                message = "Unable to Updated!";
                return {
                    status: false,
                    message: message
                }
            }
        }
    } catch (error) {
        console.error('Error in saving game data:', error);
        throw error;
    }
}
/**
 * calculat the time difference
 * @param {*} startTime 
 * @param {*} endTime 
 * @returns 
 */
const getTimeDifference = (startTime, endTime) => {
    const diffInMillis = endTime.getTime() - startTime.getTime();
    const minutes = diffInMillis / (1000 * 60);
    return minutes;
};
/** 
 * This socket will provide the time difference between current booking and next available booking.
*/
const availableTime = async (req) => {
    try {
        const current_booking = await Booking.findOne({
            include: [
                {
                    model: Lane,
                    attributes: ['id', 'name'],
                    where: {
                        id: req.laneId,
                    },
                },
            ],
            where: {
                location_id: req.location_id,
                id: req.booking_id,
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
        // return current_booking;
        if (current_booking) {
            const available_booking = await Booking.findOne({
                include: [
                    {
                        model: Lane,
                        attributes: ['id', 'name'],
                        where: {
                            id: req.laneId,
                        },
                    },
                ],
                where: {
                    booking_date: {
                        [Op.eq]: literal('DATE(NOW())')
                    },
                    start_time: {
                        [Op.gte]: current_booking.end_time
                    },
                },
                order: [['start_time', 'ASC']],
                limit: 1
            });
            if (current_booking && available_booking) {
                let timeDifference = null;
                const firstBookingEndTime = current_booking.end_time;
                const secondBookingStartTime = available_booking.start_time;
                timeDifference = getTimeDifference(firstBookingEndTime, secondBookingStartTime);
                var count = timeDifference / 30;
                const available_time = [];
                for (let i = 1; i <= count; i++) {
                    available_time.push(30 * i);
                }
                return {
                    available_time
                };
            }
            else {
                // console.log(current_booking.end_time)
                const today = new Date();
                const options = { weekday: 'long' };
                const dayName = new Intl.DateTimeFormat('en-US', options).format(today);
                const business_hours = await LocationBusinessHours.findOne({
                    where: {
                        location_id: 1,
                        day: dayName.toLowerCase(),
                    }
                });
                const business_hours_end = business_hours.end_time.split('T')[1];
                const end_time_current = current_booking.end_time
                const date = new Date(end_time_current);
                // Get hours, minutes, and seconds
                const hours = String(end_time_current.getUTCHours()).padStart(2, "0");
                const minutes = String(end_time_current.getUTCMinutes()).padStart(2, "0");
                const seconds = String(end_time_current.getUTCSeconds()).padStart(2, "0");
                const current_booking_end_time = `${hours}:${minutes}`;
                const business_hours_end_time = business_hours_end
                const currentTimeParts = current_booking_end_time.split(":");
                const currentBookingEndTime = new Date();
                currentBookingEndTime.setHours(parseInt(currentTimeParts[0]), parseInt(currentTimeParts[1]));
                const businessTimeParts = business_hours_end_time.split(":");
                const businessHoursEndTime = new Date();
                businessHoursEndTime.setHours(parseInt(businessTimeParts[0]), parseInt(businessTimeParts[1]));
                const timeDifferenceMilliseconds = businessHoursEndTime - currentBookingEndTime;
                const timeDifferenceMinutes = Math.floor(timeDifferenceMilliseconds / 60000); // 60000 milliseconds in a minute
                var count = timeDifferenceMinutes / 30;
                const available_time = [];
                for (let i = 1; i <= count; i++) {
                    available_time.push(30 * i);
                }
                return {
                    available_time
                };
                // let timeDifference = null;
                // timeDifference = getTimeDifference(business_hours_end_time,end_time_booking);
                // var count = timeDifference / 30;
                // console.log(count);
                // const available_time = [];
                // for (let i = 1; i <= count; i++) {
                //     available_time.push(30 * i);
                // }
                // return {
                //     available_time
                // };
            }
        }
    } catch (error) {
        console.error('Error in fetching current booking details:', error);
        throw error;
    }
}
/**
 * This socket is used to set the status of the particpants
 * @param {booking_id,participant_id} req 
 * @returns 
 */
const updatePartcipantStatus = async (req) => {
    try {
        const target = await ParticipantTeams.findOne({
            where: {
                booking_id: req.booking_id,
                participant_id: req.participant_id,
            }
        });
        if (target.target == 'right') {
            await ParticipantTeams.update({
                status: 0,
            }, {
                where: {
                    booking_id: req.booking_id,
                    target: 'right'
                }
            })
            const result = await ParticipantTeams.update({
                status: 1,
            }, {
                where: {
                    booking_id: req.booking_id,
                    participant_id: req.participant_id,
                }
            });
            if (result) {
                return {
                    status: true,
                    message: 'Participant Status updated successfully!.'
                }
            }
            else {
                return {
                    status: false,
                    message: 'Unable to update participant status.'
                }
            }
        }
        else {
            await ParticipantTeams.update({
                status: 0,
            }, {
                where: {
                    booking_id: req.booking_id,
                    target: 'left'
                }
            })
            const result = await ParticipantTeams.update({
                status: 1,
            }, {
                where: {
                    booking_id: req.booking_id,
                    participant_id: req.participant_id,
                }
            });
            if (result) {
                return {
                    status: true,
                    message: 'Participant Status updated successfully!.'
                }
            }
            else {
                return {
                    status: false,
                    message: 'Unable to update participant status.'
                }
            }
        }
    } catch (error) {
        console.error('Error in updating participants status:', error);
        throw error;
    }
}
/**
 * This socket code will be used to get the top 4 participant, selected participants and their stats
 * @param {booking_id} req 
 * @returns 
 */
const selectedParticipants = async (req) => {
    try {
        const topFourParticipant = await Overall.findAll({
            attributes: ['id', 'participants_id', 'total_score', 'throws', 'nu_of_throws'],
            where: {
                booking_id: req.booking_id
            },
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
            order: [['total_score', 'DESC']],
            limit: 4,
        });
        const topScorer = [];
        const activePlayers = [];
        topFourParticipant.map((participants, index) => {
            topScorer.push({
                id: participants.id,
                points: participants.total_score,
                throws: participants.throws - participants.nu_of_throws,
                name: participants.User.name
            });
        });
        const active_players = await ParticipantTeams.findAll({
            where: {
                booking_id: req.booking_id,
                status: 1
            },
            include: [{
                model: ParticipantStat,
                attributes: ['score'],
            }]
        });
        var scoreBoard = [];
        active_players.map((players, index) => {
            if (players.target == 'left') {
                const left = {
                    id: players.id,
                    participant_id: players.participant_id,
                    booking_id: players.booking_id,
                    target: players.target,
                };
                const score = players.ParticipantStats;
                const leftScore = [];
                score.map((scoreboard, index) => {
                    leftScore.push({
                        score: scoreboard.score
                    });
                });
                activePlayers.push(left);
                scoreBoard.push(leftScore)
            }
            else {
                const right = {
                    id: players.id,
                    participant_id: players.participant_id,
                    booking_id: players.booking_id,
                    target: players.target,
                };
                const score = players.ParticipantStats;
                const rightScore = [];
                score.map((scoreboard, index) => {
                    rightScore.push({
                        score: scoreboard.score
                    });
                });
                activePlayers.push(right);
                scoreBoard.push(rightScore)
            }
        });
        const all_data = {
            'topScorer': topScorer,
            'activePlayer': activePlayers,
            'scoreBoard': scoreBoard,
        }
        return all_data;
        // const active_players = await ParticipantTeams.findAll({
        //     where: {
        //         booking_id: req.booking_id,
        //         status: 1
        //     },
        //     include: [{
        //         model: ParticipantStat,
        //         attributes: ['score'],
        //     }]
        // });
        // const topScorer = [];
        // const activePlayers = [];
        // const winners = topFourParticipant.map((participants, index) => {
        //     topScorer.push({
        //         id: participants.id,
        //         points:participants.total_score,
        //         throws:participants.throws - participants.nu_of_throws,
        //         name:participants.User.name
        //     });
        // })
        // return topScorer;
        return {
            // topScorer,
            // selectedParticipants
        };
    } catch (error) {
        console.error('Error in fetching particpant scroe or selected participants:', error);
        throw error;
    }
}
const updateParticipantDetails = async (req) => {
    const transaction = await db.sequelize.transaction();
    try {
        const data = req;
        for (let i = 0; i < data.length; i++) {
            // Update user's username
            const user = await User.findOne({
                where: {
                    id: data[i].user_id,
                },
            }, {
                transaction
            });
            if (!user) {
                return {
                    status: false,
                    message: "User Id not Foud"
                }
            }
            else {
                user.name = data[i].name;
                await user.save({ transaction });
            }
            // Update name in customer details table
            const customer = await CustomerDetails.findOne({
                where: {
                    user_id: data[i].user_id,
                },
            }, {
                transaction
            });
            if (!customer) {
                return {
                    status: false,
                    message: "User Id not Foud"
                }
            }
            else {
                customer.first_name = data[i].name;
                customer.last_name = data[i].name;
                await customer.save({ transaction });
            }
            //Update other details in participants table
            const participants = await Participants.findOne({
                where: {
                    user_id: data[i].user_id,
                    booking_id: data[i].booking_id,
                },
            }, {
                transaction
            });
            if (!participants) {
                return {
                    status: false,
                    message: "User Id not Foud"
                }
            }
            else {
                participants.playing_order = data[i].playing_order;
                participants.status = data[i].status;
                await participants.save({ transaction });
            }
        }
        await transaction.commit();
        return {
            status: true,
            message: "Details Updated successfully!"
        }
    } catch (error) {
        await transaction.rollback();
        console.error('Error in updating participants details:', error);
        throw error;
    }
}
module.exports = {
    gameList,
    participantsList,
    assignTarget,
    winnerList,
    playing,
    pageLog,
    gameStarted,
    updateGameTime,
    undoThrows,
    availableTime,
    updatePartcipantStatus,
    selectedParticipants,
    updateParticipantDetails,
}
