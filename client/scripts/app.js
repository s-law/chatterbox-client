var Message = Backbone.Model.extend({

  initialize: function(text, username, roomname, createdAt, objectId) {
    this.set('text', text); 
    this.set('username', username);
    this.set('roomname', roomname)
    this.set('createdAt', createdAt)
    this.set('objectId', objectId)
  }, 
  defaults: {
    roomname: "lobby"
  }
});

var MessageView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change', this.render, this);
  }, 
  render: function() {
    var html = [
      '<div class="msg">',
        '<span class="username">',
          this.model.get('username'),
        '</span>',
        '<span class="text">',
          this.model.get('text'),
        '</span>',
      '</div>'
    ].join('');

    return this.$el.html(html);
  }
});

var Messages = Backbone.Collection.extend({

  model: Message
});

var msgTemplate = _.template('<div class="msg"><span class="username"><%- username %></span><span class="text"><%- text %></span></div>');

var MessagesView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('change', this.render, this);
  },
  render: function() {
    var html = [
      '<div class="room" id="main">',
      '</div>'
    ].join('');

    this.$el.html(html);

    this.$el.find('#main').append(this.collection.map(function(message) {
      var msg = new Message('blah', 'blahblah', 'blahblahblah', 'message.createdAt', 'message.objectId');
      return msg.render();
      // return msgTemplate({
      //   username: message.get('username'),
      //   text: message.get('text')
      // })
    }));

    return this.$el;
  }
});

var fetchData = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      var freshData = data.results;
      console.log(freshData);
      var newMsgs = new Messages(freshData);
      console.log(newMsgs);
      var newMsgsView = new MessagesView({ collection: newMsgs });

      $('body').append(newMsgsView.render());
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve messages');
    }
  });
};

fetchData();
