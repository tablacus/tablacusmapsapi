// Tablacus Maps API

tablacus =
{
    maps:
    {
        leafletjs: 'https://unpkg.com/leaflet@1.3.3/dist/leaflet.js',
        leafletcss: 'https://unpkg.com/leaflet@1.3.3/dist/leaflet.css',
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

        LatLng: function (lat, lng)
        {
            this.latlng = [lat, lng];
        },

        Map: function (el, opt)
        {
            this.opt = {};
            for (var i in opt) {
                if (opt[i]) {
                    this.opt[i] = opt[i];
                }
            }
            if (opt.center) {
                this.opt.center = opt.center.latlng;
            }
            this.map = L.map(el, this.opt);
            L.tileLayer(tablacus.maps.tileLayer, { attribution: tablacus.maps.attribution }
            ).addTo(this.map);

            this.fitBounds = function (glatlngs)
            {
                this.map.fitBounds(glatlngs.latlngs);
            }
        },

        Marker: function (opt)
        {
            opt2 = {};
            for (var i in opt) {
                if (opt2[i]) {
                    opt2[i] = opt[i];
                }
            }
            delete opt2.map;
            var latlng = opt.position ? opt.position.latlng : [];
            L.marker(latlng).addTo(opt.map.map);            
        },

        InfoWindow: function (opt)
        {
            this.popup = L.popup().setLatLng(opt.position ? opt.position.latlng : []).setContent(opt.content);
            this.open = function (map)
            {
                this.popup.openOn(map.map);
            }
        },

        Polyline: function (opt)
        {
            this.latlngs = [];
            for (var i = 0; i < opt.path.length; i++) {
                this.latlngs.push(opt.path[i].latlng);
            }
            this.polyline = L.polyline(this.latlngs, opt).addTo(opt.map.map);
            this.getPath = function ()
            {
                return {
                    latlngs: this.latlngs,

                    forEach: function (fn) {
                        for (var i in this.latlngs) {
                            var latlng = this.latlngs[i];
                            fn(new tablacus.maps.LatLng(latlng[0], latlng[1]));
                        }
                    }
                }
            }
        },

        LatLngBounds: function ()
        {
            this.latlngs = [];
            this.extend = function (latlng)
            {
                this.latlngs.push(latlng.latlng);
            }
        },

        init_: function ()
        {
            var loaded, query, result = {};
            var res, re = /tmapapi\.(js|php)\?(.*)|tmapapi\.(js|php)$/;
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
                    result[decodeURIComponent(el[0])] = decodeURIComponent(el[1]);
                }
            }
            if (!loaded) {
                var head = document.getElementsByTagName("head")[0];
                el = document.createElement("script");
                el.async = true;
                el.type = "text/javascript";
                el.src = tablacus.maps.leafletjs;
                head.appendChild(el);
                el = document.createElement("link");
                el.rel = "stylesheet";
                el.href = tablacus.maps.leafletcss;
                el.type = "text/css";
                head.appendChild(el);
            }
            if (result.callback) {
                tablacus.maps.callback0 = window[result.callback];
                tablacus.maps.callback();
            }
        },

        callback: function ()
        {
            if (!tablacus.maps.callback0) {
                return;
            }
            if (window.L) {
                return tablacus.maps.callback0();
            }
            setTimeout(tablacus.maps.callback, 500);
        }
    }
};

google = tablacus;
tablacus.maps.init_();