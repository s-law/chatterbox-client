// GLOBAL VARIABLES START HERE

var app = {};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.request = [];

app.cache = [];

app.ObjId = {};

app.roomNames = {};

app.roomSelection = 'everything';

app.friends = {};

app.init = function() {
  
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
      if (app.roomSelection !== 'everything') {
        app.init();
      }
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
        app.request.push(data.results[i]);
      }

      while (app.request.length > 0) {
        var msgHolder = app.request.pop(); 
        if(!app.ObjId[msgHolder.objectId]) {
          app.cache.unshift(msgHolder);
          // to-do:
            // 1. app.cache.pop() to keep msg limit at 100;
            // 2. change addmessage to prepend and invoke immediately
        }
      }

      for (var i = 0; i < app.cache.length; i++) {
        var msgObject = app.cache[i]
        app.addMessage(msgObject);
        app.ObjId[msgObject.objectId] = true;
      }

      app.cache = app.cache.slice(0,250);

      $( document ).ready(function() {
  // click handler for sending message
        $('#send').on("click", function(event) {
            //get all the inputs into an array.
          event.preventDefault();
          var inputs = $('input');
          var message = {
            username: inputs[0].value || "anonymous",
            text: inputs[1].value || "marco pollo",
            roomname: inputs[2].value || "Lobby"
          };
          app.send(message);
        });    

        // select handler for selecting room
        $('#roomSelect').on('change', function() {
          app.roomSelection = this.value;
          if (app.roomSelection === 'everything') {
            $('.msg').removeClass('hidden');
          } else {
            $('.msg').addClass('hidden');
            $('.'+app.roomSelection).removeClass('hidden');
            $('input')[2].value = app.roomSelection;
          }
        });

        $('.username').on('click', function() {
          if (app.friends[this.innerHTML] === undefined){
            app.friends[this.innerHTML] = this.innerHTML;
          } else {
            delete app.friends[this.innerHTML]
          }
        });
      });
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
  var safeRm = app.escapeHTML(msgObj.roomname).split(' ').join('_').split("&#039;").join('');
  var prefixClass = '<div class="msg ';

  if (app.roomSelection !== 'everything' && app.roomSelection !== safeRm) {
    prefixClass += 'hidden ';
  }


  $('#chats').append(prefixClass + safeRm + '"><span class="username"></span>:&nbsp;</div>');
  var newMsg = $('#chats').children().last();

  newMsg[0].appendChild(safeMsg);
  $('#chats span').last().append(safeName);
  if (!app.roomNames.hasOwnProperty(safeRm)) {
    app.roomNames[safeRm] = safeRm;
    app.addRoom(safeRm);
  }

  var userChk = $('#chats span').last()[0].innerHTML;
  if(app.friends[userChk]) {
    newMsg.addClass('friend');
  }
}

app.addRoom = function(roomName) {
  $('#roomSelect').append('<option value=' + roomName + '>' + roomName +'</option>');
};
// PRESENTATION SECTION ENDS HERE
app.init();
setInterval(app.init, 15000);