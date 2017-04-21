Meteor.publish('posts', function() {
	console.log('publish');
    return Posts.find();
});
