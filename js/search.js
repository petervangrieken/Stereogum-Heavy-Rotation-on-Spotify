var asyncCalls = [],  // Initiate for later
	tempPlaylist = new models.Playlist();

var $artist = '';
var $album = '';
var $spotifyuri = '';

//DOM READY
$(function(){

	//Laad de JSON op met artiesten en albums
	$.getJSON('http://janhoogeveen.eu/heavyrotation/heavyrotation.json', function(data) {

		$.each(data, function(key, val) {
			//Lege velden slaan we over
			if (key == 'undefined' || key == '') {
			//Dit zijn de albums
			} else {
				var $artist = val[0];
				var $album = val[1];
				//Als de albumnaam niet is ingevuld proberen we een self-titled album te vinden
				if ($album == '' || $album == 'undefined' || $album == null || $album == 0) {
				 $album = $artist;
				}
				
				//Nu gaan we zoeken
				var search = new models.Search('artist:'+$artist+' '+'album:'+$album+' '+'year:2011-2012');
				
				search.localResults = models.LOCALSEARCHRESULTS.APPEND; // Local files last
			
				//Zoekresultaten komen binnen
				search.observe(models.EVENT.CHANGE, function() {
						
					//Maak een lijst met tracks aan
					if(search.tracks.length) {
						tempPlaylist = new models.Playlist();
						
						var $artisturi = '';
						var $albumuri = '';
						
						$.each(search.tracks,function(index,track){
						
							if (track.album.artist.name.toLowerCase() == $artist.toLowerCase()) {
							
								$artisturi = track.album.artist.uri;
								$albumuri = track.album.uri;
							
								tempPlaylist.add(models.Track.fromURI(track.uri)); // Note: artwork is compiled from first few tracks. if any are local it will fail to generate....
							}
						});

						
						var playlistArt = new views.Player();

						playlistArt.track = tempPlaylist.get(0);
						playlistArt.context = tempPlaylist;
						
						console.log($artisturi);
						console.log($albumuri);
						
						readmorelink= "http://stereogum.com/tag/"+$artist.toLowerCase()+"/";
						
						$('#track-results').append('<h2><span><a href="'+readmorelink+'"><img src="css/images/favicon.png"></a></span> <strong><a href="'+$artisturi+'">'+$artist+'</a></strong> - <a href="'+$albumuri+'">'+$album+'</a></h2>');
						$('#track-results').append('<div class="tracklistcontainer"></div>');
						$("#track-results .tracklistcontainer:last-child").append(playlistArt.node);
	
						var playlistList = new views.List(tempPlaylist);
						playlistList.node.classList.add("temporary");
						playlistList.node.classList.add("sp-light");
						$("#track-results .tracklistcontainer:last-child").append(playlistList.node);

					}
				});
				search.appendNext();

			} //Data was niet leeg
		}); //each data item
	}); //GetJSON





}); //DOM



//Iets is klaar
function asyncComplete(key) {
	asyncCalls.splice(asyncCalls.indexOf(key), 1);
	if(asyncCalls.length==0) {
		console.log('All async calls home safely'); // <insert action that requires all async calls>
	} else {
		console.log(asyncCalls.length+" aysnc calls remaining");
	}
	// Obviously in production you would want a more robust solution that can handle calls that fail!
}