# Tablacus Maps API

Yet another Maps API with leaflet (OpenStreetMap)

## Usage

### [Async sample](http://tmapapi.netlify.com/async.html)

```js
<script>
function initMap() {
    var latlng = new google.maps.LatLng(37.7879363,-122.40751740318);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: latlng
    });
    var marker = new google.maps.Marker({
        position: latlng,
        map: map
    });
}
</script>
<script async src="tmapapi.php?callback=initMap"></script>

<div id="map" style="width: 100%; height: 400px"></div>
```

### [Sync sample](http://tmapapi.netlify.com/sync.html)

```js
<div id="map" style="width: 100%; height: 400px"></div>
<link href="https://unpkg.com/leaflet@1.3.3/dist/leaflet.css" rel="stylesheet" /><script src="https://unpkg.com/leaflet@1.3.3/dist/leaflet.js"></script><script src="tmapapi.php"></script>
<script>
var latlng = new google.maps.LatLng(37.7879363,-122.40751740318);
var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: latlng
});
var marker = new google.maps.Marker({
    position: latlng,
    map: map
});
</script>
```
