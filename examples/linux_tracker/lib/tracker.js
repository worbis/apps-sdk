$(document).ready(function() {
  btapp.add.rss_feed('http://feeds.feedburner.com/Linuxtracker');
  console.log(btapp.rss_feed.all());
  var feed = _.values(btapp.rss_feed.all())[0];
  console.log(feed.properties.keys());
  _.each(feed.item.all(), function(v,k) {
    console.log(v.properties.get('url'));
  });
});
