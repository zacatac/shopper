'use strict';

angular.module('shopApp')
    .factory('Note', function ($resource) {
	return $resource('/api/notes/:noteId');
    });

angular.module('shopApp')
    .factory('Board', ['$resource', function($resource) {
    function Board(){
    	this.service = $resource('/api/board/:id', {id: '@id'}, {
    	    'create':  { method: 'POST' },
    	    'index':   { method: 'GET', isArray: true },
    	    'show':    { method: 'GET', isArray: false },
    	    'update':  { method: 'PUT' },
    	    'edit':    { method: 'PUT' },
    	    'destroy': { method: 'DELETE' }
    	});
    }
    
    Board.prototype.all = function () {
    	return this.service.index();
    };
    
    Board.prototype.one = function(id) {
    	return this.service.show({id: id});
    };
    
    return new Board();
}]);

angular.module('shopApp')
    .controller('NotesCtrl', function ($scope, Note) {

	$scope.notes = Note.query();

	$scope.create = function(title, body) {
	    Note.save({title: title, body: body}, function(note) {
		$scope.notes.push(note);
	    });
	};

	$scope.delete = function(index) {
	    Note.delete({noteId: $scope.notes[index].id}, function() {
		$scope.notes.splice(index, 1);
	    });
	};

    });

angular.module('shopApp')
    .controller('BoardCtrl', ['$scope', 'Board', function ($scope, Board) {
	$scope.boards = Board.all();
	
	$scope.select = function(index){
	    $scope.selected = $scope.boards[index];
	};
	// $scope.create = function(title, body) {
	//   Note.save({title: title, body: body}, function(note) {
	//     $scope.notes.push(note);
	//   });
	// };

	// $scope.delete = function(index) {
	//   Note.delete({noteId: $scope.notes[index].id}, function() {
	//     $scope.notes.splice(index, 1);
	//   });
	// };

    }]);

