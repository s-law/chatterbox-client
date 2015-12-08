var app = {};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.msgs = [];

app.init = function() {

  app.fetch();
  app.clearMessages();
  // msgs.results is an array
};

// DATA I/O STUFF GOES HERE

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      for (var i = 0; i < data.results.length; i++) {
        app.msgs.push(data.results[i]);
      }
      for (var i = 0; i < app.msgs.length; i++) {
        app.addMessage(app.msgs[i]);
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve messages');
    }
  });
};

// app.escapeHTML = function(text) {
//   var map = {
//     '&': '&amp;',
//     '<': '&lt;',
//     '>': '&gt;',
//     '"': '&quot;',
//     "'": '&#039;'
//   };

//   return text ? text.replace(/[&<>"']/g, function(m) { return map[m]; }) : "";
// }

// DATA I/O SECTION ENDS HERE

// PRESENTATION STUFF GOES HERE

app.clearMessages = function() {
  //Removing all of our message elements from the chatterbox
  $('#chats').children().remove();
}

app.addMessage = function(msgObj) {
  // var safeTxt = app.escapeHTML(msgObj.text);
  var safeTxt = document.createTextNode(msgObj.text);
  $('#chats').append('<div class="msgObj"></div>');
  $('#chats').children().last()[0].appendChild(safeTxt);
  // Speculative way of identifying room name while escaping bad input goes here
  // var safeRm = document.createTextNode(msgObj.roomname);
  // $('#chats').children().last()[0].append('<div class="roomname hidden"></div>');)
  // $('#chats').children().last()[0].appendChild(safeRm);
}

app.addRoom = function() {
  $('#roomSelect').append('<div class="roomname" id="'+ message.roomname + '">' + message.roomname + '</div>');
};

// PRESENTATION SECTION ENDS HERE