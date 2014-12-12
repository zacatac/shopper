Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

var connect_and_return = function(){
    var onSuccess = function(){
	window.localStorage.setItem('trello_token_timeout', new Date().addHours(1));
	location.reload();
    };

    var onFail = function(){
	console.log("here2");
	winow.localStorage.setItem('trello_token', null);
	window.localStorage.setItem('trello_token_timeout', new Date());
    };
    Trello.authorize({
    	type:'popup',
    	name:'Shopper',
    	expiration:'1hour',
    	success:onSuccess,
    	error: onFail
    });
}
