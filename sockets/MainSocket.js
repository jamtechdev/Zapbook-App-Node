const userController = require('../controllers/Users/UsersController'); // Adjust the path
const gameController = require('../controllers/Game/GameController');
function initializeSocket(server) {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
        }
    });
    io.on('connection', async (socket) => {
        console.log("\x1b[32m", "Connected with Socket IO ....");
        socket.on('disconnect', () => {
            console.log("\x1b[31m", "Disconnected with Socket IO ....");
        });

        socket.on('participants', async (request) => {
            try {

                if (request.booking_id == '') {
                    socket.emit('validation_error', { message: 'booking Id  parameter is required!' });
                    return false;
                }
                else {
                    const participants_list = await gameController.participants_list(request);
                    socket.emit('participantsList', participants_list);
                }

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        });

        socket.on('assign_targets', async (request) => {
            try {
                // if (request.booking_id == '' && request.participants_id == '' && request.target == '') {
                //     socket.emit('validation_error', { message: 'booking Id  parameter is required!' });
                //     return false;
                // }
                const bookings = await gameController.assignTarget(request);
                socket.emit('assignTargets', bookings);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        });

        // socket.on('bookables', async (request) => {
        //     try {
        //         const bookings = await gameController.bookable_list(request);
        //         socket.emit('all_bookables', bookings);
        //     } catch (error) {
        //         console.error('Error fetching users:', error);
        //     }
        // })

        // socket.on('lane', async (request) => {
        //     try {
        //         const bookings = await gameController.lane_list(request);
        //         socket.emit('all_lanes', bookings);
        //     } catch (error) {
        //         console.error('Error fetching users:', error);
        //     }
        // })
    });
    return io;
}
module.exports = initializeSocket;
