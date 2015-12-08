// GLOBAL VARIABLES START HERE

var app = {};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.msgs = [];

app.roomNames = {};

app.init = function() {
  app.msgs = [];
  app.fetch();
  app.clearMessages();
  // msgs.results is an array
};

// GLOBAL VARIABLES END HERE

// DATA I/O STUFF STARTS HERE

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


app.escapeHTML = function(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };


  return text ? text.replace(/[&<>"']/g, function(m) { return map[m]; }) : "";
}

$( document ).ready(function() {
  $('#send').on("click", function() {
      //get all the inputs into an array.
    var inputs = $('input');
    var message = {
      username: inputs[0].value || "anonymous",
      text: inputs[1].value || "marco pollo",
      roomname: inputs[2].value || "Lobby"
    };
    app.send(message);
  });    
});

// DATA I/O SECTION ENDS HERE

// PRESENTATION STUFF STARTS HERE

app.clearMessages = function() {
  //Removing all of our message elements from the chatterbox
  $('#chats').children().remove();
}

app.addMessage = function(msgObj) {
  // var safeTxt = app.escapeHTML(msgObj.text);
  var safeMsg = document.createTextNode(msgObj.text);
  var safeName = document.createTextNode(msgObj.username);
  var safeRm = app.escapeHTML(msgObj.roomname).split(' ').join('_');

  $('#chats').append('<div class="msg ' + safeRm + '"><span class="username"></span>:&nbsp;</div>');
  var newMsg = $('#chats').children().last()[0]
  newMsg.appendChild(safeMsg);
  $('#chats span').last().append(safeName);
  if (!app.roomNames.hasOwnProperty(safeRm)) {
    app.roomNames[safeRm] = safeRm;
    app.addRoom(safeRm);
  }
}

app.addRoom = function(roomName) {
  $('#roomSelect').append('<option value=' + roomName + '>' + roomName +'</option>');
};

// PRESENTATION SECTION ENDS HERE
app.init();
setInterval(app.init, 10000);