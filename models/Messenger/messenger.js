module.exports = function (pool) {
    return{
        getMessages(sender_id,cb){
            pool.query("SELECT * FROM messenger,users WHERE (users.id = messenger.recipient_id) AND (messenger.sender_id =?)"
                ,[sender_id]
                , cb);
        },
        getChat(sender_id,recipient_id,cb){
            pool.query("SELECT * FROM messenger WHERE ((recipient_id = ?) AND (sender_id =?)) OR ((sender_id =?) AND (recipient_id = ?))"
                ,[sender_id,recipient_id,sender_id,recipient_id]
                , cb);
        }
    }
};


/*

 */


