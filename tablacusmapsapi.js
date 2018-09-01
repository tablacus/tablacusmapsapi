// Tablacus Maps API

tablacus =
{
    settings:
    {
        leafletjs: 'https://unpkg.com/leaflet@1.3.3/dist/leaflet.js',
        leafletcss: 'https://unpkg.com/leaflet@1.3.3/dist/leaflet.css',
        tilelayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },

    maps:
    {
        MapTypeId: {},
        event: {
            addListener: function ()
            {},

            trigger: function (o, event)
            {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(event, true, true);
                return !o.el.dispatchEvent(evt);    
            },
        },

        LatLng: function (lat, lng)
        {
            this.lat = lat;
            this.lng = lng;
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
            if (opt.center) {
                opt.center[0] = opt.center.lat;
                opt.center[1] = opt.center.lng;
            }
            this.map = L.map(el, opt);
            this.el = el;
            L.tileLayer(tablacus.settings.tilelayer, { attribution: tablacus.settings.attribution }
            ).addTo(this.map);

            this.fitBounds = function (glatlngs)
            {
                this.map.fitBounds(glatlngs.latlngs);
            }

            this.setCenter = function (latlng)
            {
                this.map.panTo(new L.LatLng(latlng.lat, latlng.lng));
            },

            this.setZoom = function (zoom)
            {
                this.map.setZoom(zoom);
            }
        },

        Marker: function (opt)
        {
            this.map = opt.map.map;
            if (opt.position) {
                L.marker(new L.LatLng(opt.position.lat, opt.position.lng)).addTo(opt.map.map);
                this.position = opt.position;
            }

            this.setPosition = function (latlng)
            {
                L.marker(new L.LatLng(latlng.lat, latlng.lng)).addTo(this.map);
                this.position = latlng;
            }           

            this.getPosition = function ()
            {
                return this.position;
            }

        },

        InfoWindow: function (opt)
        {
            this.popup = L.popup().setLatLng(new L.LatLng(opt.position.lat, opt.position.lng)).setContent(opt.content);
            this.open = function (map)
            {
                this.popup.openOn(map.map);
            }
        },

        Polyline: function (opt)
        {
            var latlngs = [];
            for (var i = 0; i < opt.path.length; i++) {
                latlngs.push([opt.path[i].lat, opt.path[i].lng]);
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
                latlngs.push([opt.paths[i].lat, opt.paths[i].lng]);
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
                this.latlngs.push([latlng.lat, latlng.lng]);
            }
        },

        Geocoder: function ()
        {
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
        head.appendChild(el);
    }
    if (tablacus.settings.alias) {
        window[tablacus.settings.alias] = tablacus;
    }
    tablacus.settings.callback && tablacus.maps.callback();
})();
