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

        socket.on('games', async (request) => {

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
                socket.emit('gameList', games);
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
                    socket.emit('participantsList', participants_list);
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
                    socket.emit('assignTargets', targets);
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
                    socket.emit('winnerList', winner_list);
                }
            } catch (error) {
                console.error('Error in  fetching winner list:', error);
            }
        });
        /**
         * This Socket is at the time of playing game  .
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
                }
            } catch (error) {
                console.error("Error in storing the game data:", error)
            }
        });
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
