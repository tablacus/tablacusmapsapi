# Tablacus Maps API

Yet another Maps API with leaflet (OpenStreetMap)

## Usage

**Latest version**

```html
<script async defer src="https://unpkg.com/tablacusmapsapi/tablacusmapsapi.js?alias=google&...." ></script>
```

**Specify version**  _0.1.6_

```html
<script async defer src="https://unpkg.com/tablacusmapsapi@0.1.6/tablacusmapsapi.js?alias=google&...." ></script>
```

### [Some exsamples](https://tablacus.github.io/maps/)

### [Sample](http://tmapapi.netlify.com/sample.html)

```js
<script>
var map;
var geocoder;

function initMap ()
{
    var latlng = new google.maps.LatLng(37.78, -122.41);
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: latlng
    });
    geocoder = new google.maps.Geocoder();
}

function setCenter(o)
{
    var latlng = new google.maps.LatLng(document.F.centerLat.value, document.F.centerLng.value);
    map.setCenter(latlng);
}

function marker(o)
{
    var latlng = new google.maps.LatLng(document.F.markerLat.value, document.F.markerLng.value);
    var marker = new google.maps.Marker({
        title: "Tooltip",
        position: latlng,
        map: map
    });
    var infoWin = new google.maps.InfoWindow({content:"marker Info window"});
    google.maps.event.addListener(marker, 'click', function(){
        infoWin.open(map, marker);
    });
}

function markerIcon(o)
{
    var latlng = new google.maps.LatLng(document.F.marker2Lat.value, document.F.marker2Lng.value);
    var marker = new google.maps.Marker({
        title: "Tooltip",
        position: latlng,
        icon: document.F.marker2Img.value,
        map: map
    });
    var infoWin = new google.maps.InfoWindow({content:"marker Info window"});
    google.maps.event.addListener(marker, 'click', function(){
        infoWin.open(map, marker);
    });
}

function clickEvent(o)
{
    o.disabled = true;
    google.maps.event.addListener(map, 'click', function (event)
    {
        document.getElementById("lat").innerHTML = event.latLng.lat();
        document.getElementById("lng").innerHTML = event.latLng.lng();
    });
}

function circle(o)
{
    var circle = new google.maps.Circle({
        center: new google.maps.LatLng(document.F.circleLat.value, document.F.circleLng.value),
        map: map,
        radius: document.F.circleRadius.value
      });
}

function rectangle(o)
{
    var rectangle = new google.maps.Rectangle({
        bounds: new google.maps.LatLngBounds(new google.maps.LatLng(document.F.rect1Lat.value, document.F.rect1Lng.value),
                     new google.maps.LatLng(document.F.rect2Lat.value, document.F.rect2Lng.value)),
        map: map,
      });
}

function polyline(o)
{
    var patharray = new Array();
    var ar = document.F.polylineLatLngs.value.split(/\n/);
    for (var i in ar) {
        var latlng = ar[i].split(/,/);
        if (latlng[0] && latlng[1]) {
            patharray.push(new google.maps.LatLng(latlng[0], latlng[1]));
        }
    }
    var polyline = new google.maps.Polyline({
        map: map,
        path: patharray
    });
}

function polygon(o)
{
    var patharray = new Array();
    var ar = document.F.polygonLatLngs.value.split(/\n/);
    for (var i in ar) {
        var latlng = ar[i].split(/,/);
        if (latlng[0] && latlng[1]) {
            patharray.push(new google.maps.LatLng(latlng[0], latlng[1]));
        }
    }
    var polygon = new google.maps.Polygon({
        map: map,
        paths: patharray
    });
}

function geocoding()
{
    geocoder.geocode( { 'address': document.F.geoQuery.value },
        function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latlng = results[0].geometry.location;
                map.setCenter(latlng);
                document.getElementById('geoLat').innerHTML = latlng.lat();
                document.getElementById('geoLng').innerHTML = latlng.lng();

                var marker = new google.maps.Marker({
                    title: document.F.geoQuery.value,
                    position: latlng,
                    map: map
                });
            }
        }
    );
}

function toggle(s)
{
    var o = document.getElementById(s);
    o.style.display = /none/i.test(o.style.display) ? "block" : "none"; 
}
</script>
<script async src="https://unpkg.com/tablacusmapsapi/tablacusmapsapi.js?callback=initMap&alias=google"></script>

<div id="map" style="width: calc(100% - 20em); height: 100%; float: left"></div>
<form name="F">
    <input type="button" value="+" onclick="toggle('_setCenter')">
    <div id="_setCenter" style="display: none">
        lat:<input type="number" name="centerLat" value="37.78"><br>
        lng:<input type="number" name="centerLng" value="-122.41">
    </div>
    <input type="button" value="setCenter" onclick="setCenter(this)">
    <hr>
    <input type="button" value="+" onclick="toggle('_clickEvent')">
    <input type="button" value="Click event" onclick="clickEvent(this)">
    <div id="_clickEvent" style="display: none">
        lat: <span id="lat"></span><br>
        lng: <span id="lng"></span><br>
    </div>
    <hr>
    <input type="button" value="+" onclick="toggle('_marker')">
    <div id="_marker" style="display: none">
        lat: <input type="number" name="markerLat" value="37.78"><br>
        lng: <input type="number" name="markerLng" value="-122.41">
    </div>
    <input type="button" value="Marker" onclick="marker(this)"><br>
    <hr>
    <input type="button" value="+" onclick="toggle('_marker2')">
    <div id="_marker2" style="display: none">
        lat: <input type="number" name="marker2Lat" value="37.82"><br>
        lng: <input type="number" name="marker2Lng" value="-122.37"><br>
        img: <input type="text" name="marker2Img" value="./xf.png">
    </div>
    <input type="button" value="Marker icon" onclick="markerIcon(this)"><br>
    <hr>
    <input type="button" value="+" onclick="toggle('_circle')">
    <div id="_circle" style="display: none">
        lat:<input type="number" name="circleLat" value="37.86"><br>
        lng:<input type="number" name="circleLng" value="-122.43"><br>
        radius:<input type="number" name="circleRadius" value="2500">
    </div>
    <input type="button" value="Circle" onclick="circle(this)"><br>
    <hr>
    <input type="button" value="+" onclick="toggle('_rectangle')">
    <div id="_rectangle" style="display: none">
        lat:<input type="number" name="rect1Lat" value="37.77"><br>
        lng:<input type="number" name="rect1Lng" value="-122.45"><br>
        lat:<input type="number" name="rect2Lat" value="37.74"><br>
        lng:<input type="number" name="rect2Lng" value="-122.51"><br>
    </div>
    <input type="button" value="Rectangle" onclick="rectangle(this)"><br>
    <hr>
    <input type="button" value="+" onclick="toggle('_polyline')">
    <div id="_polyline" style="display: none">
        <textarea name="polylineLatLngs" style="height: 5em">37.78,-122.44
37.78,-122.47
37.86,-122.49
        </textarea>
    </div>
    <input type="button" value="Polyline" onclick="polyline(this)"><br>
    <hr>
    <input type="button" value="+" onclick="toggle('_polygon')">
    <div id="_polygon" style="display: none">
        <textarea name="polygonLatLngs" style="height: 5em">37.77,-122.42
37.80,-122.27
37.72,-122.21
        </textarea>
    </div>
    <input type="button" value="Polygon" onclick="polygon(this)"><br>
    <hr>
    <input type="button" value="+" onclick="toggle('_geocoding')">
    <div id="_geocoding" style="display: none">
        lat:<span id="geoLat"></span><br>
        lng:<span id="geoLng"></span><br>
        <input type="text" name="geoQuery" value="berkeley">
    </div>
    <input type="button" value="Geocoding" onclick="geocoding(this)"><br>
    <hr>
</form>
```
