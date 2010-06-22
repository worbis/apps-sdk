function popup(options){
	options.windowName = options.windowName ||  'ConnectWithOAuth'; // should not include space for IE
	options.windowOptions = options.windowOptions || 'location=0,status=0,width=800,height=400';
	options.callback = options.callback || function(){ window.location.reload(); };
	var that = this;

	that._oauthWindow = window.open(options.path, options.windowName, options.windowOptions);
	that._oauthInterval = window.setInterval(function(){
		if (that._oauthWindow.closed) {
			window.clearInterval(that._oauthInterval);
			options.callback();
		}
	}, 1000);
	return that;
}
module('window');
test('open_close', function() {
	expect(3);
	stop();
	var window1 = popup({path="", callback=function(){ok(true, "Window 1 has been closed.");}});
	var window2 = popup({path="", callback=function(){ok(true, "Window 2 has been closed.");}});
	var window3 = popup({path="", callback=function(){ok(true, "Window 3 has been closed.");}});
	window1._oauthWindow.close();
	window2._oauthWindow.close();
	window3._oauthWindow.close();
	setTimeout(function(){start();}, 1500);
});

