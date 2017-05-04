var express = require('express');
var router = express.Router();
var {database} = require('../database/database');

function getPlayersInfo(req, res, next){
  const gameID = parseInt(req.query.gameID);
  const getPlayersInGameQuery = `SELECT * FROM registeredUsers WHERE playerID IN (Select playerID FROM Players WHERE gameID = $1)`;
  const playersInGame = [];

  database.any(getPlayersInGameQuery, [gameID])
    .then(function(data){
      if (data != null && data.length > 0)
      {
        for (var index = 0; index < data.length; index++)
        {
            playersInGame[index] = data[index].username;
        }
      }
      res.locals.playersInGame = playersInGame;
      next();
    })
    .catch(function(error) {
      console.log("ERROR:",error);
      return res.send(error);
    });
}

function loadCards(req, res, next){
  var deck = [];
  const getCardsFromDeckQuery = `SELECT * FROM deck`;

  database.any(getCardsFromDeckQuery)
    .then(function(data){
      if (data != null && data.length > 0)
      {
        for (var index = 0; index < data.length; index++)
        {
          var card = new Object();
          card.card_id = data.card_id;
          card.card_name = data.card_name;
          card.value = data.value;
          deck[index] = card;
        }
      }
      res.local.deck = deck;
    })
  }

function shuffleCards(req, res, next){
  var deck = res.locals.deck;
  shuffle(deck);
  res.locals.deck = deck;
}

function shuffle(array){
  for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

//this is barebones right now, mainly pulling the name of the game from db to display
router.use(function getGameInfo(req, res, next){
  const gameID = parseInt(req.query.gameID);
  console.log("calling game functions");
  res.locals.gameID = gameID;
  console.log("gameID = ", gameID);
  const getGameInfoQuery = `select * from Games where gameid = $1`;
  database.oneOrNone(getGameInfoQuery, [gameID])
    .then(function(data){
      console.log("running query");
      res.locals.gameRoomName = data.gameroomname;
      res.locals.gameID = data.gameid;
      res.locals.max_players = data.max_players;
      res.locals.current_players = data.current_players;
      next();
    })
    .catch(function(error) {
      console.log("ERROR:",error);
      return res.send(error);
      });
});

router.use(getPlayersInfo);

router.get('/', function(req, res, next) {
  res.render('gameroom', {username:req.session.passport.user, gameRoomName: res.locals.gameRoomName, players: res.locals.playersInGame});
});

module.exports = router;