# Tablacus Maps API

Yet another Maps API with leaflet (OpenStreetMap)

## Usage

### [Async sample](http://tmapapi.netlify.com/async.html)

```js
<script>
function initMap() {
    var latlng = new google.maps.LatLng(37.7879363, -122.40751740318);
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
<script async src="https://unpkg.com/tablacusmapsapi@0.0.7/tablacusmapsapi.js?callback=initMap&alias=google"></script>

<div id="map" style="width: 100%; height: 400px"></div>
```

### [Sync sample](http://tmapapi.netlify.com/sync.html)

```js
<div id="map" style="width: 100%; height: 400px"></div>
<link href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css" rel="stylesheet" /><script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"></script><script src="https://unpkg.com/tablacusmapsapi@0.0.7/tablacusmapsapi.js?alias=google"></script>
<script>
var latlng = new google.maps.LatLng(37.7879363, -122.40751740318);
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
