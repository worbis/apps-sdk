function popup(options){
  // should not include space for IE
  options.windowName = options.windowName ||  'ConnectWithOAuth';
  options.windowOptions = options.windowOptions || 'location=0,status=0,width=800,height=400';
  options.callback = options.callback || function(){ window.location.reload(); };
  var self = this;

  self._oauthWindow = window.open(options.path, options.windowName,
                                  options.windowOptions);
  self._oauthInterval = window.setInterval(function(){
    if (self._oauthWindow.closed) {
      window.clearInterval(self._oauthInterval);
      options.callback();
    }
  }, 1000);
  return self;
}

module('window');

// test('open_close1', function() {
//   expect(1);
//   stop();
//   var window1 = popup({path:"", callback: function() {
//     ok(true, "t1: Window 1 has been closed.");
//   }});
//   window1._oauthWindow.close();
//   setTimeout(function(){start();}, 2000);
// });

// test('open_close2', function() {
//   expect(2);
//   stop();
//   var window2 = popup({path:"", windowName:"Window1", callback: function() {
//     ok(true, "t2: Window 1 has been closed.");
//   }});
//   window2._oauthWindow.close();
//   var window3 = popup({path:"", windowName:"Window2", callback: function() {
//     ok(true, "t2: Window 2 has been closed.");
//   }});
//   window3._oauthWindow.close();
//   setTimeout(function(){start();}, 4000);
// });

