const pool = require('../config/pool');
const Messenger = require('../models/Messenger/messenger')(pool);
module.exports = function (server) {
    var io = require('socket.io').listen(server);
    var room = 'room#';
    var connections = [];
    var users = [];

    io.on('connection', function (socket) {
        //connections.push(socket);
        //console.log('connected length : ' + connections.length);

        socket.on('disconnect', function () {
            connections.splice(connections.indexOf(socket), 1);
            //console.log('user disconnected: ' + connections.length);
        });

        io.emit('new', 'www');

        socket.on('subscribe', function (roomName) {
            // var str = roomName.split(" ");
            // var room = str[0] + '###' + str[1];
            // socket.join(room);
            socket.join(roomName);
        });

        socket.on('send-ms', function (data) {
            // console.log("data.text: " + data.text);
            var room = (data.sender_id + data.recipient_id) + 'www';
            io.sockets.in(room).emit('new-ms', data);
            Messenger.sendMessages(data.sender_id,data.recipient_id,data.date,data.text,function (err,rows) {
              //  console.log('ms: ' + err);
            })
        });

        socket.on('unsubscribe', function (room) {
            try {
               // console.log('[socket]', 'leave room :', room);
                socket.leave(room);
                // socket.to(room).emit('user left', socket.id);
            } catch (e) {
               // console.log('[error]', 'leave room :', e);
                //socket.emit('error','couldnt perform requested action');
            }
        })
    });


};

