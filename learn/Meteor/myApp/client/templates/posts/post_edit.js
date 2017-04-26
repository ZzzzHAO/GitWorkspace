Template.postEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentPostId = this._id;

        var postProperties = {
            _id: currentPostId,
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };
        var errors = validatePost(postProperties);
        if (errors.title || errors.url)
            return Session.set('postEditErrors', errors);
        // Posts.update(currentPostId, {$set: postProperties}, function(error) {
        //   if (error) {
        //     // 向用户显示错误信息
        //     alert(error.reason);
        //   } else {
        //     Router.go('postPage', {_id: currentPostId});
        //   }
        // });
        Meteor.call('postUpdate', postProperties, function(error, result) {
            // 显示错误信息并退出
            if (error){
                
                debugger;
                return throwError(error.reason);
            }
            // 显示结果，跳转页面
            if (result.postExists)
                throwError('This link has already been posted（该链接已经存在）');
            Router.go('postPage', { _id: result._id });
        });

    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('postsList');
        }
    }
});
Template.postEdit.onCreated(function() {
    Session.set('postEditErrors', {});
});
Template.postEdit.helpers({
    errorMessage: function(field) {
        return Session.get('postEditErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
    }
});
