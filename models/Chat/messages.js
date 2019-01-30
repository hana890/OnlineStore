module.exports = function (pool) {
    return{
        getMessages(sender_id,cb){
            pool.query("SELECT DISTINCT  sender_id, recipient_id, username, text,date, users.id  FROM messenger, users  WHERE  (users.id = recipient_id AND sender_id = ? ) OR (users.id = sender_id AND recipient_id = ? )"
                ,[sender_id,sender_id]
                , cb);
        },
        getChat(sender_id,recipient_id,cb){
            pool.query("SELECT  * FROM messenger WHERE ((recipient_id = ?) AND (sender_id =?)) OR ((sender_id =?) AND (recipient_id = ?))"
                ,[sender_id,recipient_id,sender_id,recipient_id]
                , cb);
        },
        sendMessages(sender_id,recipient_id,date,text,cb){
            pool.query("INSERT INTO messenger SET ?",
                {   sender_id,
                    recipient_id,
                    date,
                    text
                }, cb);
        }
    }
};


/*

 */


