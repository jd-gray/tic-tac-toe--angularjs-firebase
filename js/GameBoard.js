(function(){
	angular
		.module('tictactoeApp')
		.factory('GameBoard', GameBoardFunc);

	GameBoardFunc.$inject = ['$firebase'];

	function GameBoardFunc($firebase){
		var TILE_STATES = ['unselected-tile','x-player', 'o-player'];

		var GameBoard = function(numTiles){
			
			// Define self
			var self = this;

			self.playerTurn = 0;
			self.numTiles = numTiles;
			self.tiles = new Array(numTiles);
			self.toggleTile = toggleTile;
			self.getTileState = getTileState;
			self.checkWinner = checkWinner;
			self.clearBoard = clearBoard;
		
			// firebase- For Player Count <3
			function loveMeThatHotFire(){
				
				self.playerNumber = -1;
				
				self.lobby = getLobby();
				
				self.lobby.$loaded(function(){
					if(!self.lobby.numPlayers){
						self.lobby.numPlayers = 0;
						self.lobby.$save();
					}

					self.playerNumber = self.lobby.numPlayers;
				
					if(self.lobby.numPlayers === 0 || self.lobby.numPlayers === 1){
						self.lobby.numPlayers +=1;
						self.lobby.$save();
					}
					else{
						alert("Sorry the game is full");
						window.location.replace("http://www.jaredgray.us");
					}
				});	
			}
			loveMeThatHotFire();

			// firebase - Lobby <3
			function getLobby() {
				var ref = new Firebase("https://jaredttt.firebaseio.com/lobby");
				var lobby = $firebase(ref).$asObject();
				return lobby;
			}

			// firebase- Game <3
			function giveMeHotFire(){
				var main = new Firebase("https://jaredttt.firebaseio.com/game");
				var game = $firebase(main).$asObject();
				self.game = game;
			 	self.game.fireGame = self.tiles;
			 	self.game.playerScoreX = 0;
			 	self.game.playerScoreO = 0;
			 	self.game.playerTie = 0;
			 	self.game.playerXmove = 0;
			 	self.game.playerOmove = 0;
			 	self.game.playerTurn = 0;
			 	self.game.winner = "";
			 	self.game.$save();
			}
			giveMeHotFire();

			// Player Toggle
			function toggleTile(num){
				// user can't repeat on same tile
				if(self.playerNumber % 2 === 0 && self.game.playerTurn % 2 === 0){
					self.game.fireGame[num] = (self.game.fireGame[num] + 1) % TILE_STATES.length;
					self.game.fireGame[num] = 1;
					self.game.playerXmove++;
					self.game.playerTurn++;
					self.game.$save();
				}
				else if(self.playerNumber % 2 !== 0 && self.game.playerTurn % 2 !== 0){
					self.game.fireGame[num] = (self.game.fireGame[num] + 2) % TILE_STATES.length;
					self.game.fireGame[num] = 5;
					self.game.playerOmove++;
					self.game.playerTurn++;
					self.game.$save();
				}
				checkWinner();
				self.game.$save();		
			}

			function getTileState(num){
				return TILE_STATES[self.game.fireGame[num]];
			}

			// fill array with zero values
				for (var i = 0; i < 9; i++){
				self.game.fireGame[i] = 0;
				self.game.$save();
			}

			// used for checking horizontal, vertical, diagonal
			function checkRowWinner(i1, i2, i3, array, value){
				return array[i1] + array[i2] + array[i3] === value;
			}

			// used to check for tie game
			function checkTie(i1,i2,i3,i4,i5,i6,i7,i8,i9, array, value){
			 	return array[i1]+array[i2]+array[i3]+array[i4]+array[i5]
			 	+array[i6]+array[i7]+array[i8]+array[i9] === value;
			 }

			 // Clear board
			function clearBoard(){
					for (var i = 0; i < 9; i++){
					self.game.fireGame[i] = 0;
					self.game.$save();
				}
			}

			// Clear winner message
			function clearWinner(){
				return self.game.winner = "";
			}

			// Check for game winner
			function checkWinner(){
					if (checkRowWinner(0,1,2, self.game.fireGame, 3) ||
						checkRowWinner(3,4,5, self.game.fireGame, 3) ||
						checkRowWinner(6,7,8, self.game.fireGame, 3) ||
						checkRowWinner(0,4,8, self.game.fireGame, 3) ||
						checkRowWinner(2,4,6, self.game.fireGame, 3) ||
						checkRowWinner(0,3,6, self.game.fireGame, 3) ||
						checkRowWinner(1,4,7, self.game.fireGame, 3) ||
						checkRowWinner(2,5,8, self.game.fireGame, 3)){
						self.game.winner = "Player 1 Wins!";
						setTimeout(clearBoard, 3000);
						setTimeout(clearWinner, 1000);
						self.game.playerScoreX += 1;
						self.game.playerXmove = 0;
						self.game.playerOmove = 0;
						self.game.$save();		
					}
					else if(checkRowWinner(0,1,2, self.game.fireGame, 15) ||
							checkRowWinner(3,4,5, self.game.fireGame, 15) ||
							checkRowWinner(6,7,8, self.game.fireGame, 15) ||
							checkRowWinner(0,4,8, self.game.fireGame, 15) ||
							checkRowWinner(2,4,6, self.game.fireGame, 15) ||
							checkRowWinner(0,3,6, self.game.fireGame, 15) ||
							checkRowWinner(1,4,7, self.game.fireGame, 15) ||
							checkRowWinner(2,5,8, self.game.fireGame, 15)){
							self.game.winner = "Player 2 Wins!";
							setTimeout(clearBoard, 3000);
							setTimeout(clearWinner, 1000);
							self.game.playerScoreO += 1;
							self.game.playerXmove = 0;
							self.game.playerOmove = 0;
							self.game.$save();		
					}
					else if(checkTie(0,1,2,3,4,5,6,7,8, self.game.fireGame, 25) ||
					 	checkTie(0,1,2,3,4,5,6,7,8, self.game.fireGame, 29)){
					 	self.game.winner= "Tie Game";
					 	setTimeout(clearBoard, 3000);
					 	setTimeout(clearWinner, 1000);
					 	self.game.playerTie += 1;
					 	self.game.playerXmove = 0;
					 	self.game.playerOmove = 0;
						self.game.$save();
					 } 
			}		
		}
		return GameBoard;
	}
})();