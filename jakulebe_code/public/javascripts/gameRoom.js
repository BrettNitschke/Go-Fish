const gameID = document.currentScript.getAttribute('gameID');
const playerID = document.currentScript.getAttribute('playerID');
const username = document.currentScript.getAttribute('username');
const playerNumber = document.currentScript.getAttribute('playerNumber');
const playerChannel = gameID.toString() + username;
const userPackage = new Object();

userPackage.gameID = gameID;
userPackage.playerID = playerID;
userPackage.username = username;
userPackage.playerChannel = playerChannel;
userPackage.playerNumber = playerNumber;
userPackage.currentPlayerTurn = 1;

var socket = io();

socket.emit('JOIN_GAME', userPackage);

socket.on('TEST', function(userPackage) {
    $('.message').text(`${userPackage.username} connected`)
})

socket.on('PLAYER_TEST', function(userPackage) {
    $('.playerMessage').text(`this message is for ${userPackage.username} only`);
})



socket.on('SEND_CARDS', function(cardString) {

    $('.show-player > .col-sm-1 > img ').hide();


})

$(document).ready(() => {
    $('#startGame').hide()

    socket.on('START_GAME_BUTTON', function(userPackage) {
        $('#startGame').show()
    })

    $('#startGame button').click(event => {
        //$( '#startGame').hide()
        socket.emit('START_GAME', userPackage);
    })

    socket.on('STARTING_GAME', function(cardTestString) {
        $('#startGame').hide()
        $('.hand').text('game starting')
        socket.emit('GET_HAND', userPackage)
        //socket.emit('DEAL_CARDS', userPackage)
    })
})
