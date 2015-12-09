var FriendUtil = function(name,ask,displayName){
	this.name=name;
	this.ask=ask;
    this.displayName=displayName;
}
FriendUtil.prototype.setName=function(name){
	this.name=name;
}
FriendUtil.prototype.setAsk=function(ask){
	this.ask=ask;
}
FriendUtil.prototype.setDisplayName=function(displayName){
    this.displayName=displayName;
}
FriendUtil.prototype.getFriends=function(collection,callback){
	var query={_id:this.name};
    collection.find(query,{friend_user:1,_id:0},function(err, doc){
        callback(doc);
    })
}
FriendUtil.prototype.getFav=function(collection,callback){
    var query={"_id":this.name};
    collection.find(query,{fav_user:1,_id:0}, function(err,docs){
        callback(docs);
    });
}
FriendUtil.prototype.getRequests=function(collection,callback){
	var query={"_id":this.name};
    collection.find(query,{request_user:1,_id:0}, function(err,docs){
        callback(docs);
    });
}
FriendUtil.prototype.addFav=function(collection,callback){
    var query={"_id":this.name};
    var request={"request_id":this.ask};
    console.log(this.ask);
    console.log(this.name);
    
    var question = {"user_id": this.ask, "user_name": this.displayName};
    var ids = [this.ask];
    collection
    .update({"_id": this.name, "fav_user.user_id": {"$nin": ids} },
      {"$addToSet": { "fav_user": question}})
    .exec(function(err, updated){
      if(err){
        reject(err);
      }
      if(updated) {
        callback(updated);
      }
  });
    
}
FriendUtil.prototype.cancelFav=function(collection,callback){
    var query={"_id":this.name };
    var request={"request_id":this.ask};
    console.log(this.ask);
    console.log(this.name);
    
    var user = {"user_id": this.ask, "user_name": this.displayName};
    var ids = [this.ask];
    collection
    .update({"_id": this.name},
      {"$pull": { "fav_user": user}})
    .exec(function(err, updated){
      if(err){
        reject(err);
      }
      if(updated) {
        callback(updated);
      }
  });
    
}
FriendUtil.prototype.askAdd=function(collection,callback){
	var query={"_id":this.ask};
	var request={"request_id":this.name};
    console.log(this.ask);
    console.log(this.name);
	
    var question = {"user_id": this.name, "user_name": this.displayName};
    var ids = [this.name];
    collection
    .update({"_id": this.ask, "request_user.user_id": {"$nin": ids} },
      {"$addToSet": { "request_user": question}})
    .exec(function(err, updated){
      if(err){
        reject(err);
      }
      if(updated) {
        callback(updated);
      }
  });
    
}
FriendUtil.prototype.agreeRequest=function(collection, callback){
	var query={"_id":this.name, "friend_user.user_id": {"$nin": [this.ask]}};
	var askquery={"_id":this.ask,"friend_user.user_id": {"$nin": [this.name]}};
	var request={request_user:{"user_id": this.ask, "user_name": this.displayName}};
	var friend={friend_user:{"user_id": this.ask, "user_name": this.displayName}};
	var askfriend={friend_user:{"user_id": this.name, "user_name": this.displayName}};
	
	collection.update(query,{$pull:request,$addToSet:friend},function(err, docs) {
        if (err) {
            console.log(err);
            return;
        }
        collection.update(askquery,{$addToSet:askfriend},function(err, docs) {
            if (err) {
                console.log(err);
                return;
            }
            callback(docs);

        });
    });
}
FriendUtil.prototype.deleteFriend=function(collection,callback){
	var query={"_id":this.name};
	var askquery={"_id":this.ask};
	var friend={friend_user:{"user_id": this.ask, "user_name": this.displayName}};
	var askfriend={friend_user:{"user_id": this.name, "user_name": this.displayName}};
	console.log(query);
	collection.update(query,{$pull:friend},function(err, docs) {
        if (err) {
            console.log(err);
            return;
        }
        callback(docs);
    });
    collection.update(askquery,{$pull:askfriend},function(err, docs) {
        if (err) {
            console.log(err);
            return;
        }
     
    });
}
FriendUtil.prototype.denyRequest=function(collection,callback){
	var query={"_id":this.name};
	var request={request_user:{"user_id": this.ask, "user_name": this.displayName}};
	collection.update(query,{$pull:request},function(err, docs) {
        if (err) {
            console.log(err);
            return;
        }
        callback(docs);
    });
}
var friendUtil=new FriendUtil();
module.exports=friendUtil;