var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
   
        var data = new Date();
        var reponse = 'Data : ' + data + ' Numero: ' + msg.valor;

        postaData = {
            valor: msg.valor,
            data: reponse
        };
        io.emit('chat message', postaData);
        socket.broadcast.emit('chat message', msg + 'LONX');
        console.log('Celular: ' + msg.valor);
    });
});

var users = {};
var userNames = {};

io.on('connection', function(socket){
  //console.log('a user connected');
//   socket.on('login', function(data){
//     console.log('a user ' + data.userId + ' connected');
//     //saving userId to array with socket ID
//     users[socket.id] = data.userId;
//   });
  socket.on('disconnect', function(){
    console.log('user ' + users[socket.id] + ' disconnected');
  });

       
    socket.on('setSocketId', function(data) {
        var userName = data.name;
        var userId = data.userId;
        userNames[userName] = userId;
    });

});

http.listen(3000, () => {
    console.log('Rodando na porta *:3000');
});

function getConnectedList ()
{
    let list = []

    for ( let client in io.sockets.connected )
    {
        list.push(client)
       // list.push(client.username);
       
    }

    return list
}


setInterval(function() {
    console.log("===Clientes Conectados==="+new Date());
    console.log(getConnectedList());
    console.log("=====Fim Clientes Conectados ====");
}, 9000);

