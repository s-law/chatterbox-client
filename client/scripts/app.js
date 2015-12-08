// GLOBAL VARIABLES START HERE

var app = {};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.msgs = [];

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

// PRESENTATION STUFF STARTS HERE

app.clearMessages = function() {
  //Removing all of our message elements from the chatterbox
  $('#chats').children().remove();
}

app.addMessage = function(msgObj) {
  // var safeTxt = app.escapeHTML(msgObj.text);
  var safeMsg = document.createTextNode(msgObj.text);
  var safeName = document.createTextNode(msgObj.username);

  $('#chats').append('<div class="msg"><span class="username"></span>:&nbsp;</div>');
  var newMsg = $('#chats').children().last()[0]
  // newMsg.appendChild('<span>' + safeName + '</span>');
  // newMsg.appendChild(safeName);
  newMsg.appendChild(safeMsg);
  $('#chats span').last().append(safeName);
  // console.log(newMsg.children());
  // newMsg.children().first().style('color', 'red'); 

  // Speculative way of identifying room name while escaping bad input goes here
  // var safeRm = document.createTextNode(msgObj.roomname);
  // $('#chats').children().last()[0].append('<div class="roomname hidden"></div>');)
  // $('#chats').children().last()[0].appendChild(safeRm);
}

app.addRoom = function() {
  $('#roomSelect').append('<div class="roomname" id="'+ message.roomname + '">' + message.roomname + '</div>');
};

// PRESENTATION SECTION ENDS HERE
app.init();
setInterval(app.init, 10000);