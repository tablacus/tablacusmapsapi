// Tablacus Maps API

tablacus =
{
    settings:
    {
        leafletjs: 'https://unpkg.com/leaflet@1.3.4/dist/leaflet.js',
        leafletcss: 'https://unpkg.com/leaflet@1.3.4/dist/leaflet.css',
        tilelayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },

    maps:
    {
        MapTypeId: {},
        event: {
            addListener: function (event, fn)
            {
                
            },

            trigger: function (o, event)
            {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(event, true, true);
                return !o.el.dispatchEvent(evt);    
            },
        },

        LatLng: function (lat, lng)
        {
            this[0] = lat;
            this[1] = lng;

            this.lat = function ()
            {
                return this[0];
            };

            this.lng = function ()
            {
                return this[1];
            };
        },

        LLatLng: function (latlng)
        {
            if (latlng) {
                return [/function/.test(latlng.lat) ? latlng.lat() : latlng.lat, /function/.test(latlng.lng) ? latlng.lng() : latlng.lng];
            }
        },

        LatLngs: function (latlngs)
        {
            this.latlngs = latlngs;

            this.forEach = function (fn) {
                for (var i in this.latlngs) {
                    var latlng = this.latlngs[i];
                    fn(new tablacus.maps.LatLng(latlng[0], latlng[1]));
                }
            }
        },

        Map: function (el, opt)
        {
            if (opt.scrollWheelZoom === undefined) {
                opt.scrollWheelZoom = false;
            }
            if (opt.tap === undefined) {
                opt.tap = false;
            }
            if (opt.dragging === undefined) {
                opt.dragging = window.ontouchstart !== null;
            }
            var glatlng = opt.center;
            opt.center = tablacus.maps.LLatLng(opt.center);
            this.map = L.map(el, opt);
            opt.center = glatlng;
            this.el = el;
            L.tileLayer(tablacus.settings.tilelayer, { attribution: tablacus.settings.attribution }
            ).addTo(this.map);

            this.fitBounds = function (latlngs)
            {
                var llatlngs = [];
                for (var i in latlngs.latlngs)
                {
                    llatlngs.push(tablacus.maps.LLatLng(latlngs.latlngs[i]));
                }
                this.map.fitBounds(llatlngs);
            }

            this.setCenter = function (latlng)
            {
                try {
                    this.map.panTo(tablacus.maps.LLatLng(latlng));
                } catch (e) {}
            },

            this.setZoom = function (zoom)
            {
                this.map.setZoom(zoom);
            }
        },

        Marker: function (opt)
        {
            this.map = opt.map.map;
            this.marker = L.marker();

            this.setPosition = function (latlng)
            {
                if (latlng) {
                    this.marker.setLatLng(tablacus.maps.LLatLng(latlng));
                }
            }           

            this.getPosition = function ()
            {
                var latlng = this.marker.getLatLng(); 
                return new tablacus.maps.LatLng(latlng[0], latlng[1]);
            }

            this.setPosition(opt.position);
            this.marker.addTo(opt.map.map);
        },

        InfoWindow: function (opt)
        {
            this.popup = L.popup().setContent(opt.content);
            this.open = function (map)
            {
                this.popup.openOn(map.map);
            }
            if (opt.position) {
                this.popup.setLatLng(tablacus.maps.LLatLng(opt.position));
            }
        },

        Polyline: function (opt)
        {
            var latlngs = [];
            for (var i = 0; i < opt.path.length; i++) {
                latlngs.push(tablacus.maps.LLatLng(opt.path[i]));
            }
            this.polyline = L.polyline(latlngs, opt).addTo(opt.map.map);
            this.getPath = function ()
            {
                return new tablacus.maps.LatLngs(latlngs);
            }
        },

        Polygon: function (opt)
        {
            var latlngs = [];
            for (var i = 0; i < opt.paths.length; i++) {
                latlngs.push(tablacus.maps.LLatLng(opt.paths[i]));
            }
            this.polyline = L.polygon(latlngs, opt).addTo(opt.map.map);
            this.getPaths = function ()
            {
                return new tablacus.maps.LatLngs(latlngs);
            }
        },

        LatLngBounds: function ()
        {
            this.latlngs = [];
            this.extend = function (latlng)
            {
                this.latlngs.push(latlng);
            }
        },

        Geocoder: function ()
        {
            this.geocode = function (opt, callback)
            {
                var url = "https://nominatim.openstreetmap.org/search?format=xml&q=" + encodeURIComponent(opt.address);
                var xhr = new XMLHttpRequest();
                xhr.onload = function() 
				{ 
                    var results = [];
                    var xml = xhr.responseXML.getElementsByTagName("place");
                    for (var i = 0; i < xml.length; i++) {
                        var o = { 
                            geometry: {
                                location: new tablacus.maps.LatLng(xml[i].getAttribute("lat"), xml[i].getAttribute("lon"))
                            },
                            formatted_address: xml[i].getAttribute("display_name"),
                            address_components: []
                        }
/*
                        var child = xml[i].childNodes;
                        for (var j = child.length; j--;) {
                            var n = child[j].tagName;
                            if (n == 'house_number') {
                                o.address_components.unshift({
                                    "long_name" : child[j].textContent,
                                    "short_name" : child[j].textContent,
                                    "types" : [ "street_number", n ]
                                });
                            }
                            if (n == 'road') {
                                o.address_components.unshift({
                                    "long_name" : child[j].textContent,
                                    "short_name" : child[j].textContent,
                                    "types" : [ "route", n ]
                                });
                            }
                            if (n == 'village') {
                                o.address_components.unshift({
                                    "long_name" : child[j].textContent,
                                    "short_name" : child[j].textContent,
                                    "types" : [ "locality", "political", n ]
                                });
                            }
                        }
*/
                        results.push(o);
                    }
                    callback(results, tablacus.maps.GeocoderStatus.OK);
				}
                xhr.open("GET", url, true);
    			xhr.send(null);
            }
        },

        GeocoderStatus: {
            OK: "OK",
            UNKNOWN_ERROR: "UNKNOWN_ERROR",
            OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
            REQUEST_DENIED: "REQUEST_DENIED",
            INVALID_REQUEST: "INVALID_REQUEST",
            ZERO_RESULTS: "ZERO_RESULTS",
            ERROR: "ERROR"            
        },

        callback: function ()
        {
            if (window.L && /object|function/i.test(typeof window[tablacus.settings.callback])) {
                return window[tablacus.settings.callback]();
            }
            setTimeout(tablacus.maps.callback, 500);
        }
    }
};

(function ()
{
    var loaded, query, res, re = /tablacusmapsapi\.(js|php)\?(.*)|tablacusmapsapi\.(js|php)$/;
    var scripts = document.getElementsByTagName('script');
    for (var i in scripts) {
        var src = scripts[i].src;
        if (res = re.exec(src)) {
            query = res[2];
        }
        loaded |= /leaflet\.js$/.test(src);
    }
    //<?= "\n            query = '" . $_SERVER['QUERY_STRING'] . "';\n"; ?>
    if (query) {
        var param = query.split('&');
        for(var j in param) {
            var el = param[j].split('=');
            tablacus.settings[decodeURIComponent(el[0])] = decodeURIComponent(el[1]);
        }
    }
    if (!loaded) {
        var head = document.getElementsByTagName("head")[0];
        el = document.createElement("script");
        el.async = true;
        el.type = "text/javascript";
        el.src = tablacus.settings.leafletjs;
        head.appendChild(el);
        el = document.createElement("link");
        el.rel = "stylesheet";
        el.href = tablacus.settings.leafletcss;
        el.type = "text/css";
		el.onload = function ()
		{
			var css = document.styleSheets.item(0);
	        css.insertRule('.leaflet-zoom-box { z-index: 280 !important; }', css.cssRules.length);
	        css.insertRule('.leaflet-pane { z-index: 240 !important; }', css.cssRules.length);
	        css.insertRule('.leaflet-overlay-pane { z-index: 240 !important; }', css.cssRules.length);
	        css.insertRule('.leaflet-shadow-pane { z-index: 250 !important; }', css.cssRules.length);
	        css.insertRule('.leaflet-marker-pane { z-index: 260 !important; }', css.cssRules.length);
	        css.insertRule('.leaflet-tooltip-pane { z-index: 265 !important; }', css.cssRules.length);
	        css.insertRule('.leaflet-popup-pane { z-index: 270 !important; }', css.cssRules.length);
	        css.insertRule('.leaflet-control { z-index: 280 !important; }', css.cssRules.length);
	        css.insertRule('.leaflet-top, .leaflet-bottom { z-index: 299 !important; }', css.cssRules.length);
	        css.insertRule('.ai1ec-gmap-link { z-index: 299 !important; }', css.cssRules.length);
        };
        head.appendChild(el);
    }
    if (tablacus.settings.alias) {
        window[tablacus.settings.alias] = tablacus;
    }
    tablacus.settings.callback && tablacus.maps.callback();
})();
