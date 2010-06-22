var li_template = ["li", "{{label}}", "{{property}}"];
var opt_template = ["option", {"value":"{{hash}}"}, "{{name}}"];
var properties = {"remaining":"Remaining: ", 
			"size":"Size: ", 
			"progress":"Progress: ", 
			"download_speed":"Download speed: ", 
			"eta":"ETA: ", 
			"peers_connected":"Peers: ", 
			"peers_in_swarm":"Total peers: ", 
			"seeds_connected":"Seeds: ", 
			"seeds_in_swarm":"Total seeds: "};
			
$(document).ready(function() {
	$.each(bt.torrent.keys(), function(i, item){
		$("#torrentSelector").append($(JUP.html({hash:item, name:bt.torrent.get(item).properties.get("name")}, opt_template)));
	});
	$("#torrentSelector").change(function() { 
		var torrent = bt.torrent.get($("#torrentSelector").val());
		$("#torrentinfo").html("");
		$.each(properties, function(prop, lbl){
			$("#torrentinfo").append($(JUP.html({property:torrent.properties.get(prop), label:lbl}, li_template)));
		});
	});
});
