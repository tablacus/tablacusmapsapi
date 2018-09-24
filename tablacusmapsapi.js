// Tablacus Maps API

tablacus =
{
    settings:
    {
        leafletjs: 'https://unpkg.com/leaflet@1.3.4/dist/leaflet.js',
        leafletcss: 'https://unpkg.com/leaflet@1.3.4/dist/leaflet.css',
        tilelayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        geocoder: 'https://nominatim.openstreetmap.org/search?format=xml&q='
    },

    maps:
    {
        MapTypeId: {},
        event: {
            addListener: function (o, en, fn)
            {
                o.$.on(en, function (e)
                {
                    e.latLng = new tablacus.maps.LatLng(e.latlng.lat, e.latlng.lng);
                    fn(e);
                });
            },

            trigger: function (o, en)
            {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(en, true, true);
                return !o.el.dispatchEvent(evt);    
            },
        },

        LatLng: function (lat, lng)
        {
            this[0] = lat;
            this[1] = lng;
        },

        LLatLng: function (latlng)
        {
            if (latlng) {
                return [/function/.test(latlng.lat) ? latlng.lat() : latlng.lat, /function/.test(latlng.lng) ? latlng.lng() : latlng.lng];
            }
        },

        LatLngs: function (latlngs)
        {
            this.$ = latlngs;
        },

        Map: function (el, opt)
        {
            this.opt = {};
            for (var i in opt) {
                this.opt[i] = opt[i];
            }
            if (opt.scrollWheelZoom === undefined) {
                this.opt.scrollWheelZoom = false;
            }
            if (opt.tap === undefined) {
                this.opt.tap = false;
            }
            if (opt.dragging === undefined) {
                this.opt.dragging = window.ontouchstart !== null;
            }
            this.opt.center = tablacus.maps.LLatLng(opt.center);
            this.$ = L.map(el, this.opt);
            this.el = el;
            L.tileLayer(tablacus.settings.tilelayer, { attribution: tablacus.settings.attribution }
            ).addTo(this.$);
        },

        Marker: function (opt)
        {
            this.map = opt.map.$;
            this.$ = L.marker();
            this.opt = {};
            for (var i in opt) {
                this.opt[i] = opt[i];
            }
            if (opt.title) {
                this.$.bindTooltip(opt.title);
            }
            if (opt.icon) {
                var el = new Image();
                var $ = this.$;
                el.onload = function ()
                {
                    $.setIcon(L.icon({
                        iconUrl: opt.icon,
                        iconSize: [el.naturalWidth, el.naturalHeight],
                        iconAnchor: [el.naturalWidth / 2, el.naturalHeight],
                        popupAnchor: [0,  -el.naturalHeight],
                        tooltipAnchor: [el.naturalWidth / 2, -el.naturalHeight / 2]
                    }));
                }
                el.src = opt.icon;
            }
            this.setPosition(opt.position);
        },

        InfoWindow: function (opt)
        {
            this.$ = L.popup().setContent(opt.content);
            if (opt.position) {
                this.$.setLatLng(tablacus.maps.LLatLng(opt.position));
            }
        },

        Polyline: function (opt)
        {
            this.map = opt.map.$;
            var latlngs = [];
            for (var i = 0; i < opt.path.length; i++) {
                latlngs.push(tablacus.maps.LLatLng(opt.path[i]));
            }
            this.$ = L.polyline(latlngs, opt).addTo(opt.map.$);
        },

        Polygon: function (opt)
        {
            this.map = opt.map.$;
            var latlngs = [];
            for (var i = 0; i < opt.paths.length; i++) {
                latlngs.push(tablacus.maps.LLatLng(opt.paths[i]));
            }
            this.$ = L.polygon(latlngs, opt).addTo(opt.map.$);
        },

        Circle: function (opt)
        {
            this.map = opt.map.$;
            this.$ = L.circle(tablacus.maps.LLatLng(opt.center), opt).addTo(this.map);
        },

        Rectangle: function (opt)
        {
            this.map = opt.map.$;
            this.$ = L.rectangle(opt.bounds.$, opt).addTo(this.map);
        },

        LatLngBounds: function ()
        {
            this.$ = [];
            for (var i = 0; i < arguments.length; i++) {
                this.$.push(tablacus.maps.LLatLng(arguments[i]));
            }
        },

        Geocoder: function () {},

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

tablacus.maps.LatLng.prototype = {
    lat: function ()
    {
        return this[0];
    },

    lng: function ()
    {
        return this[1];
    }
}

tablacus.maps.Map.prototype = {
    fitBounds: function (bounds)
    {
        this.$.fitBounds(bounds.$);
    },

    setCenter: function (latlng)
    {
        try {
            this.$.panTo(tablacus.maps.LLatLng(latlng));
        } catch (e) {}
    },

    setZoom: function (zoom)
    {
        this.$.setZoom(zoom);
    },

    getZoom: function ()
    {
        return this.$.getZoom();
    },

    panTo: function (latlng)
    {
        try {
            this.$.panTo(tablacus.maps.LLatLng(latlng));
        } catch (e) {}
    },

    setMapTypeId: function (id)
    {
    }
};

tablacus.maps.Marker.prototype = {
    setPosition: function (latlng)
    {
        if (latlng) {
            this.$.setLatLng(tablacus.maps.LLatLng(latlng));
            if (!this.getVisible() && this.opt.visible !== false) {
                this.setVisible(true);
            }
        }
    },

    getPosition: function ()
    {
        var latlng = this.$.getLatLng(); 
        return new tablacus.maps.LatLng(latlng[0], latlng[1]);
    },

    getVisible: function ()
    {
        return this.map.hasLayer(this.$);
    },

    setVisible: function (b)
    {
        if (b != this.getVisible()) {
            this.opt.visible = b;
            if (b) {
                this.map.addLayer(this.$);
            } else {
                this.map.removeLayer(this.$);
            }
        }
    }
};

tablacus.maps.InfoWindow.prototype = {
    open: function (map, opt)
    {
        if (opt) {
            opt.$.bindPopup(this.$).openPopup();
            return;
        }
        map.$.openPopup(this.$);
    },

    close: function ()
    {
        map.$.closePopup(this.$);
    }
};

tablacus.maps.Polyline.prototype.getPath = function ()
{
    return new tablacus.maps.LatLngs(this.$.getLatLngs());
}

tablacus.maps.Polygon.prototype.getPaths = function ()
{
    var r = [];
    var o = this.$.getLatLngs();
    for (var i = 0; i < o.length; i++) {
        r.push(new tablacus.maps.LatLngs(o[i]));
    }
    return r;
}

tablacus.maps.LatLngs.prototype.forEach = function (fn)
{
    for (var i = 0; i < this.$.length; i++) {
        fn(new tablacus.maps.LatLng(this.$[i].lat, this.$[i].lng));
    }
};

tablacus.maps.LatLngBounds.prototype.extend = function (latlng)
{
    this.$.push(tablacus.maps.LLatLng(latlng));
};

tablacus.maps.Geocoder.prototype.geocode = function (opt, callback)
{
    var url = tablacus.settings.geocoder + encodeURIComponent(opt.address);
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
        callback(results, results.length ? tablacus.maps.GeocoderStatus.OK : tablacus.maps.GeocoderStatus.ZERO_RESULTS);
    }
    xhr.open("GET", url, true);
    xhr.send(null);
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
    if (tablacus.settings.alias) {
        window[tablacus.settings.alias] = tablacus;
    }
    if (loaded) {
        tablacus.settings.callback && tablacus.maps.callback();
    } else {
        var head = document.getElementsByTagName("head")[0];
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
        if (tablacus.settings.callback) {
            el = document.createElement("script");
            el.async = true;
            el.type = "text/javascript";
            el.src = tablacus.settings.leafletjs;
            el.onload = tablacus.maps.callback;
            head.appendChild(el);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", tablacus.settings.leafletjs, false);
            xhr.send(null);
            new Function(xhr.responseText)();
            tablacus.settings.callback && tablacus.maps.callback();
        }
    }
})();
