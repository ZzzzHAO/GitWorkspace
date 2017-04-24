var postsData = [{
    title: 'Introducing Telescope',
    url: 'http://sachagreif.com/introducing-telescope/'
}, {
    title: 'Meteor',
    url: 'http://meteor.com'
}, {
    title: 'The Meteor Book',
    url: 'http://themeteorbook.com'
}];
Template.postsList.helpers({
    posts: function() {
        return Posts.find({}, { sort: { submitted: -1 } });
    }
});
Template.postItem.helpers({
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    }
});
Template.postItem.events({
    'click .delete': function(e) {
        Meteor.call('postRemove', post, function(error, result) {
            var s=Posts.find({}, { sort: { submitted: -1 } });
            var post = {
                id: $(e.target).find('[name=url]').val(),
            };
            // 显示错误信息并退出
            if (error)
                return alert(error.reason);
            // 显示结果，跳转页面
            if (result.postExists)
                alert('This link has already been posted（该链接已经存在）');
            Router.go('postPage', { _id: result._id });
        });
    }
});
