<?php
	error_reporting(-1);
	require_once('simple_html_dom.php');
	$albums[] = '';

$aConfig= Array(
	'stereogum' => Array(
		'url' => 'http://stereogum.com/heavy-rotation/page/',
		'numpages' => 7,
		'article' => 'div.photothumb',
		'title' => 'div.posttitle'
	)
);

foreach($aConfig as $site=>$config) {

	//Stereogum

	for($i=1; $i <= $config['numpages']; $i++) {
	
		unset($html);
		$html = file_get_html($config['url'].$i);
	
		// Find all article blocks
		foreach($html->find($config['article']) as $album) {
			$item['title'] = $album->find($config['title'], 0)->plaintext;

			$pieces = explode(" - ", $item['title']);
			$artist = trim($pieces[0]);
			$albumtitle = trim($pieces[1]);

			$artistalbum = array();
			array_push($artistalbum, $artist, $albumtitle);
			array_push($albums, $artistalbum);
		}
	}
}

	$jsonalbums = json_encode($albums);
	$fp = fopen('heavyrotation.json', 'w');
	fwrite($fp, $jsonalbums);
	fclose($fp);

?>