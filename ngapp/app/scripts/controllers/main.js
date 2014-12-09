'use strict';

angular.module('shopApp')
    .factory('Note', function ($resource) {
	return $resource('/api/notes/:noteId');
    });

angular.module('shopApp')
    .factory('Board', ['$resource', function($resource) {
    function Board(){
    	this.service = $resource('/api/board/:id', {id: '@id', token: '@token'}, {
    	    'create':  { method: 'POST' },
    	    'index':   { method: 'GET', isArray: true },
    	    'show':    { method: 'GET', isArray: false },
    	    'update':  { method: 'PUT' },
    	    'edit':    { method: 'PUT' },
    	    'destroy': { method: 'DELETE' }
    	});
    }
    
    Board.prototype.all = function (token) {
    	return this.service.index({token: token});
    };
    
    Board.prototype.one = function(token, id) {
    	return this.service.show({id: id, token: token});
    };
    
    return new Board();
}]);

angular.module('shopApp')
    .factory('List', ['$resource', function($resource) {
    function List(){
    	this.service = $resource('/api/list/:id', {id: '@id', token: '@token'}, {
    	    'create':  { method: 'POST' },
    	    'index':   { method: 'GET', isArray: true },
    	    'show':    { method: 'GET', isArray: false },
    	    'update':  { method: 'PUT' },
    	    'edit':    { method: 'PUT' },
    	    'destroy': { method: 'DELETE' }
    	});
    }
        
    List.prototype.one = function(token, id, callback) {
	callback = typeof callback !== 'undefined' ? callback : function(){};
    	return this.service.show({id: id, token: token}, callback);
    };
    
    return new List();
}]);

angular.module('shopApp')
    .factory('Card', ['$resource', function($resource) {
    function Card(){
    	this.service = $resource('/api/card/:id', {id: '@id', token: '@token'}, {
    	    'create':  { method: 'POST' },
    	    'index':   { method: 'GET', isArray: true },
    	    'show':    { method: 'GET', isArray: false },
    	    'update':  { method: 'PUT' },
    	    'edit':    { method: 'PUT' },
    	    'destroy': { method: 'DELETE' }
    	});
    }
        
    Card.prototype.one = function(token, id) {	
    	return this.service.show({id: id, token: token});
    };
    
    return new Card();
}]);


angular.module('shopApp')
    .factory('Session', ['$resource', function($resource) {
    function Session(){
    	this.service = $resource('/api/sessions/:id', {id: 'auth'}, {
    	    'create':  { method: 'POST' },
    	    'update':  { method: 'PUT' },
    	    'destroy': { method: 'DELETE' }
    	});
    }
        
    Session.prototype.store = function(token) {
	$scope.token = token
    };
    
    return new Session();
}]);

angular.module('shopApp')
    .factory('Grocer', ['$resource', function($resource) {
    function Grocer(){
    	this.service = $resource('/api/grocer/:id', {id: '@id', items: '@id'}, {
    	    'create':  { method: 'POST' },
    	    'index':   { method: 'GET', isArray: true },
    	    'show':    { method: 'GET', isArray: false },
    	    'update':  { method: 'PUT' },
    	    'edit':    { method: 'PUT' },
    	    'destroy': { method: 'DELETE' }
    	});
    }
        
    Grocer.prototype.shop = function(items) {	
    	return this.service.show({id: 1, items: JSON.stringify(items)});
    };
    
    return new Grocer();
}]);


angular.module('shopApp')
    .controller('BoardCtrl', 
		['$scope', '$window', '$routeParams', '$location', '$cookieStore', 'Board', 'List', 'Card', 'Session', 'Grocer', 
		 function ($scope, $window, $routeParams, $location, $cookieStore, Board, List, Card, Session, Grocer) {
		         
		     if ($routeParams.token != null){
			 $cookieStore.put("trello_oauth_token", $routeParams.token);
		     }
		     var timeout = new Date(window.localStorage.getItem('trello_token_timeout'));
		     var current = new Date();
		     if (timeout.getTime() < current.getTime()) {
			 window.localStorage.removeItem('trello_token', null);
			 window.localStorage.setItem('trello_token_timeout', current);
		     } 		     
		     $scope.model = {
			 token: window.localStorage.getItem('trello_token'),
			 oauth: $cookieStore.get('trello_oauth_token'),
			 timeout: window.localStorage.getItem('trello_token_timeout')
		     };
		     if ($scope.model.token == null && $scope.model.oauth == null){
			 return;
		     }
		     $scope.boards = Board.all($scope.model.token);
		     $scope.select = function(index){
			 $scope.selected = Board.one($scope.model.token, $scope.boards[index].id);	    
		     };

		     $scope.cards = function(index){
			 var after_http  = function() {
			     var detailCardData = [];
	    		     for (var i = 0; i < listCards.cards.length; i++){		
	    		     	 var cardData = Card.one($scope.model.token, listCards['cards'][i].id);
	    		     	 detailCardData.push(cardData);
	    		     }
			     $scope.detailCardData = detailCardData;
			 };
			 var listCards = List.one($scope.model.token, $scope.selected['lists'][index].id, after_http);
			 $scope.listCards = listCards;
		     };

		     $scope.addItem = function(card_index, check_index, item_index){
			 var item = $scope.detailCardData[card_index]['checklists'][check_index]['check_items'][item_index];
			 $scope.shoppingList.push(item);
		     };
		     
		     $scope.addAll = function(card_index){
			 var checklists = $scope.detailCardData[card_index]['checklists'];
			 var items;
			 for (var i = 0; i < checklists.length; i++){
			     items = checklists[i]['check_items'];
			     for (var j = 0; j < items.length; j++){
				 $scope.shoppingList.push(items[j]);
			     }
			 }
		     }

		     $scope.addAllUnchecked = function(card_index){
			 var checklists = $scope.detailCardData[card_index]['checklists'];
			 var items, item;
			 for (var i = 0; i < checklists.length; i++){
			     items = checklists[i]['check_items'];
			     for (var j = 0; j < items.length; j++){
				 item = items[j];
				 if (item.state === "incomplete"){
				     $scope.shoppingList.push(items[j]);
				 }
			     }
			 }
		     }
		     $scope.shoppingListRemove = function(index){
			 $scope.shoppingList.splice(index, 1);			 
		     }
		     
		     $scope.goShopping = function(){
			 var termsList = [];
			 for (var i = 0; i < $scope.shoppingList.length; i++){
			     termsList.push($scope.shoppingList[i].name);
			 }
			 $scope.shoppingData = Grocer.shop(termsList);
		     }
		 }]);
