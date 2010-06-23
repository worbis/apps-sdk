function popup(options){
	options.windowName = options.windowName ||  'ConnectWithOAuth'; // should not include space for IE
	options.windowOptions = options.windowOptions || 'location=0,status=0,width=800,height=400';
	options.callback = options.callback || function(){ window.location.reload(); };
	var that = this;

	that._oauthWindow = window.open(options.path, options.windowName, options.windowOptions);
	that._oauthInterval = window.setInterval(function(){
		if (that._oauthWindow.closed) {
			window.clearInterval(that._oauthInterval);
			console.log(options.windowName);
			options.callback();
		}
	}, 1000);
	return that;
}
module('window');
test('open_close1', function() {
	expect(1);
	stop();
	var window1 = popup({path:"", callback:function(){ok(true, "t1: Window 1 has been closed.");}});
	window1._oauthWindow.close();
	setTimeout(function(){start();}, 2000);
});
test('open_close2', function() {
	expect(2);
	stop();
	var window3 = popup({path:"", windowName:"Window1", callback:function(){ok(true, "t2: Window 1 has been closed.");}});
	window3._oauthWindow.close();
	setTimeout(function(){console.log("Waited to open window 2.");}, 4000);
	var window4 = popup({path:"", windowName:"Window2", callback:function(){ok(true, "t2: Window 2 has been closed.");}});	
	window4._oauthWindow.close();
	setTimeout(function(){start();}, 4000);
});
test('open_close3', function() {
	expect(3);
	stop();
	var window5 = popup({path:"", windowName:"t3w1", callback:function(){ok(true, "t3: Window 1 has been closed.");}});
	window5._oauthWindow.close();
	var window6 = popup({path:"", windowName:"t3w2", callback:function(){ok(true, "t3: Window 2 has been closed.");}});
	window6._oauthWindow.close();
	var window7 = popup({path:"", windowName:"t3w3", callback:function(){ok(true, "t3: Window 3 has been closed.");}});
	window7._oauthWindow.close();
	setTimeout(function(){start();}, 5000);
});

