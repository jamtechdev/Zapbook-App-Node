const gameController = require('../controllers/Game/GameController');
function initializeSocket(server) {
    /**
     * for handling cors issue .
     */
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
        }
    });
    io.on('connection', async (socket) => {
        /**
         * This Socket will work establishing connection with socket .
         * 
         */
        console.log("\x1b[32m", "Connected with Socket IO ....");

        socket.on('booking', async (request) => {

            try {
                // if (request.timezone == '') {
                //     socket.emit('validation_error', { message: 'Timezone  parameter is required!' });
                //     return false;
                // } else if (request.location_id == '') {
                //     socket.emit('validation_error', { message: 'location Id parameter is required!' });
                //     return false;
                // }
                // else if (request.lane_id == '') {
                //     socket.emit('validation_error', { message: 'lane Id  parameter is required!' });
                //     return false;
                // }
                // else {
                const games = await gameController.gameList(request);
                io.emit(`location:${request.location_id}:laneId:${request.lane_id}:booking`, games);
                // }

            } catch (error) {
                console.error('Error fetching participants:', error);
            }
        });
        /**
         * This Socket will provide you the participants list.
         * 
         */
        socket.on('participants', async (request) => {
            try {
                if (request.booking_id == '') {
                    socket.emit('validation_error', { message: 'booking Id  parameter is required!' });
                    return false;
                }
                else {
                    const participants_list = await gameController.participantsList(request);
                    io.emit(`partcipantsList`, participants_list);
                }
            } catch (error) {
                console.error('Error fetching participants:', error);
            }
        });
        /**
         * This Socket will assign targets on the participants (left or right).
         * 
         */
        socket.on('assign_targets', async (request) => {
            try {
                if (request.booking_id == '') {
                    socket.emit('validation_error', { message: 'booking Id  parameter is required!' });
                    return false;
                }
                else if (request.participants_id == '') {
                    socket.emit('validation_error', { message: 'Participants Id  parameter is required!' });
                    return false;
                } else if (request.target == '') {
                    socket.emit('validation_error', { message: 'Target  parameter is required!' });
                    return false;
                }
                else {
                    const targets = await gameController.assignTarget(request);

                    const participants_list = await gameController.participantsList(request);
                    io.emit(`booking:${request.booking_id}:laneId:${request.lane_id}:participants`, participants_list);
                }
            } catch (error) {
                console.error('Error in creating targets:', error);
            }
        });
        /**
         * This Socket will provide you all the participants Order by Score.
         * First Participant in the list is the winner
         * 
         */
        socket.on('winner_list', async (request) => {
            try {
                if (request.booking_id == '') {
                    socket.emit('validation_error', { message: 'booking Id  parameter is required!' });
                    return false;
                }
                else {
                    const winner_list = await gameController.winnerList(request)
                    io.emit('winnerList', winner_list);
                }
            } catch (error) {
                console.error('Error in  fetching winner list:', error);
            }
        });
        /**
         * This Socket is used at the time of playing game  .
         * it will create data in the participants stat and create or update data in overall table.
         */
        socket.on('playing', async (request) => {
            try {
                if (request.booking_id == '') {
                    socket.emit('validation_error', { message: 'booking Id  parameter is required!' });
                    return false;
                }
                else if (request.participant_id == '') {
                    socket.emit('validation_error', { message: 'Participant Id  parameter is required!' });
                    return false;
                } else if (request.status == '') {
                    socket.emit('validation_error', { message: 'Status  parameter is required!' });
                    return false;
                }
                else if (request.score == '') {
                    socket.emit('validation_error', { message: 'Score  parameter is required. Hint (hit or miss)!' });
                    return false;
                }
                else if (request.game_id == '') {
                    socket.emit('validation_error', { message: 'Game id  parameter is required!' });
                    return false;
                }
                else {
                    const playing = await gameController.playing(request);
                    socket.emit('PlayingTime', playing);

                    const participants_list = await gameController.participantsList(request);
                    io.emit(`booking:${request.booking_id}:laneId:${request.lane_id}:participants`, participants_list);
                }
            } catch (error) {
                console.error("Error in storing the game data:", error)
            }
        });

        /**
         * this Socket is used to save the page log
         */

        socket.on('create-page-log', async (request) => {
            try {
                if (request.location_id == '') {
                    socket.emit('validation_error', { message: 'location Id  parameter is required!' });
                    return false;
                }
                else if (request.lane_id == '') {
                    socket.emit('validation_error', { message: 'Lane Id  parameter is required!' });
                    return false;
                } else if (request.page == '') {
                    socket.emit('validation_error', { message: 'Page  parameter is required!' });
                    return false;
                }
                else if (request.reservation_id == '') {
                    socket.emit('validation_error', { message: 'Reservation Id  parameter is required!' });
                    return false;
                }
                else {
                    const pageLog = await gameController.pageLog(request);
                    //io.emit('PageLog', pageLog);
                }

            } catch (error) {
                console.error("Error in storing the page log:", error)
            }
        });

        /**
                * this Socket is used to save game start time
                */
        socket.on('game_started', async (request) => {
            if (request.lane_id == '') {
                socket.emit('validation_error', { message: 'Lane Id parameter is required!' });
                return false;
            }
            else if (request.booking_id == '') {
                socket.emit('validation_error', {
                    message: 'booking Id Parameter is required!'
                });
                return false;
            }
            else {
                const game_started = await gameController.gameStarted(request);

                io.emit(`booking:${request.booking_id}:laneId:${request.lane_id}:timer`, game_started);
            }
        });
        /**
                 * this Socket is used to update the end time of game
                 */
        socket.on('add_time', async (request) => {
            if (request.lane_id == '') {
                socket.emit('validation_error', { message: 'Lane Id parameter is required!' });
                return false;
            }
            else if (request.booking_id == '') {
                socket.emit('validation_error', {
                    message: 'booking Id Parameter is required!'
                });
                return false;
            }
            else {
                const update_game_time = await gameController.updateGameTime(request);
                io.emit(`booking:${request.booking_id}:laneId:${request.lane_id}:addTimer`, update_game_time);
            }
        })

        /**
         * this Socket is used to undo the given throws
         */
        socket.on('undo_throws', async (request) => {
            try {
                if (request.booking_id == '') {
                    socket.emit('validation_error', { message: 'booking Id  parameter is required!' });
                    return false;
                }
                else if (request.participant_id == '') {
                    socket.emit('validation_error', { message: 'Participant Id  parameter is required!' });
                    return false;
                } else if (request.status == '') {
                    socket.emit('validation_error', { message: 'Status  parameter is required!' });
                    return false;
                }
                else if (request.score == '') {
                    socket.emit('validation_error', { message: 'Score  parameter is required. Hint (hit or miss)!' });
                    return false;
                }
                else {
                    const undo_data = await gameController.undoThrows(request);
                    io.emit('undoThrows', undo_data);

                    const participants_list = await gameController.participantsList(request);
                    io.emit(`booking:${request.booking_id}:laneId:${request.lane_id}:participants`, participants_list);

                }
            } catch (error) {
                console.error("Error in storing the game data:", error)
            }
        });

        /**
       * this socket is used to get the time difference between current booking and available booking.
       */
        socket.on('available_time', async (request) => {
            try {
              
                const avail_time = await gameController.availableTime(request);
                io.emit(`availableTime`, avail_time);
            } catch (error) {
                console.error("Error in storing the game data:", error)
            }
        });

        /** 
         * This socket is used for request assistance.
         */
        socket.on('request_assistance', async (request) => {
            try {
                io.emit(`booking:${request.booking_id}:laneId:${request.lane_id}:requestAssistance`, {
                    status: true
                });
            } catch (error) {
                console.error("Error in storing the game data:", error)
            }
        });

        /** 
        * This socket is used for update the participants status
        */

        socket.on('update_participant_status', async (request) => {
            try {
                const participantStatus = await gameController.updatePartcipantStatus(request);
                io.emit('updateStatusPartcipant', participantStatus);
            } catch (error) {
                console.error("Error in updating participants status:", error)
            }
        });
        /** 
                * This socket is used for selected participants.
                */
        socket.on('selected_participants', async (request) => {
            try {
                const selected_participant = await gameController.selectedParticipants(request);
                io.emit('selectedParticipants', selected_participant);
            } catch (error) {
                console.error("Error in fetching selected participants:", error)
            }
        })
        /**
         * This socket will be used to update the user details.
         */
        socket.on('update_participant_details', async (request) => {
            try {
                
                const updateParticipant = await gameController.updateParticipantDetails(request);
                io.emit('updateParticipantDetails', updateParticipant);
            } catch (error) {
                console.error("Error in fetching selected participants:", error)   
            }
        })






        /**
         * This Socket will worked when socket connection will be disconnected.
         * 
         */
        socket.on('disconnect', () => {
            console.log("\x1b[31m", "Disconnected with Socket IO ....");
        });
    });
    return io;
}
module.exports = initializeSocket;