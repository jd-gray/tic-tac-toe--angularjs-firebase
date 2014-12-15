(function(){	
	angular
		.module('tictactoeApp')
		.controller('gameController', gameControllerFunc);

	gameControllerFunc.$inject = ['GameBoard'];

	function gameControllerFunc(GameBoard){

		this.gameName = "Tic Tac Toe";

		this.activeBoard = new GameBoard(9);
	}
})();