Posts = new Mongo.Collection('posts');
Posts.allow({
    insert: function(userId, doc) {
        // 只允许登录用户添加帖子.
        return !!userId;
    }
});
