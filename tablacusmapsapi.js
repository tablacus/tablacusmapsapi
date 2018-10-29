// Tablacus Maps API @0.1.5

tablacus =
{
    settings:
    {
        leafletjs: 'https://unpkg.com/leaflet@1.3.4/dist/leaflet.js',
        leafletcss: 'https://unpkg.com/leaflet@1.3.4/dist/leaflet.css',
        tilelayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        geocoder: 'https://nominatim.openstreetmap.org/search?format=xml&addressdetails=0&q=',
        reverse: 'https://nominatim.openstreetmap.org/reverse?format=xml&lat={lat}&lon={lng}&zoom=18&addressdetails=0'
    },

    maps:
    {
        MapTypeId: {},
        MapTypeControlStyle: {},
        Animation: {},
        ControlPosition: {
            TOP_LEFT: 'topleft',
            LEFT_TOP: 'topleft',
            TOP_RIGHT: 'topright',
            RIGHT_TOP: 'topright',
            BOTTOM_LEFT: 'bottomleft',
            LEFT_BOTTOM: 'bottomleft',
            BOTTOM_RIGHT:'bottomright',
            RIGHT_BOTTOM: 'bottomright',
            TOP_CENTER: 'topleft',
            BOTTOM_CENTER:'bottomleft',
            LEFT_CENTER: 'topleft',
            RIGHT_CENTER: 'topright',
        },
        ZoomControlStyle: {},

        event: {
            addListener: function (o, en, fn)
            {
                o.$.on(tablacus.maps.event.alias[en] || en, function (e)
                {
                    if (e.latlng) {
                        e.latLng = new tablacus.maps.LatLng(e.latlng);
                    }
                    fn.call(o, e);
                });
            },

            trigger: function (o, en)
            {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(en, true, true);
                return !o.el.dispatchEvent(evt);    
            },

            addDomListener: function (o, en, fn, b)
            {
                o.addEventListener(en, fn, b);
            },

            alias: {
                center_changed: "move",
                zoom_changed: "zoom"
            }
        },

        LatLng: function (lat, lng, noWrap)
        {
            if (arguments.length > 1) {
                this.$ = L.latLng(lat, lng);
                if (!noWrap) {
                    this.$ = this.$.wrap();
                }
                return;
            }
            this.$ = lat;
        },

        LatLngs: function (latlngs, callback)
        {
            this.$ = latlngs;
            this.callback = callback;
        },

        Map: function (el, opt)
        {
            this.opt = {};
            this.setOptions(opt);
            this.$ = L.map(el, this.opt);
            this.el = el;
            L.tileLayer(tablacus.settings.tilelayer, { attribution: tablacus.settings.attribution }
            ).addTo(this.$);
            this.setOptions(opt);
            this.mapTypes = {
                set: function (n, o) {
                    tablacus.maps.MapTypeId[n] = o;
                }
            }
            this.controls = {};
            for (var n in tablacus.maps.ControlPosition) {
                this.controls[tablacus.maps.ControlPosition[n]] = [];
            }
            this.data = {
                setStyle: function (fn) {},
                addGeoJson: function (cities) {}
            };
            this.$.on("moveend", function ()
            {
                var center = this.getCenter();
                this.eachLayer(function (layer)
                {
                    if (layer.getLatLng && layer.setLatLng) {
                        var p = [false];
                        var latlng = tablacus.maps.LLatLng(layer.getLatLng(), center, p);
                        if (p[0]) {
                            layer.setLatLng(latlng);
                        }
                    }
                    if (layer.getLatLngs && layer.setLatLngs) {
                        var p = [false];
                        var latlngs = tablacus.maps.LLatLngs(layer.getLatLngs(), center, p);
                        if (p[0]) {
                            layer.setLatLngs(latlngs);
                        }
                    }
                });
            });
        },

        Marker: function (opt)
        {
            this.initOptions("Marker", opt);
            this.$ = L.marker(this.opt.position || [0, 0], this.opt);
            this.icon = {};
            if (opt) {
                this.setMap(opt.map);
                this.setOptions(opt);
            }
        },

        InfoWindow: function (opt)
        {
            this.initOptions("InfoWindow", opt);
            this.$ = L.popup(opt);
            this.setOptions(opt);
        },

        Polyline: function (opt)
        {
            this.initOptions("Polyline", opt);
            this.$ = L.polyline([]);
            if (opt) {
                this.setMap(opt.map);
                this.setOptions(opt);
            }
        },

        Polygon: function (opt)
        {
            this.initOptions("Polygon", opt);
            this.$ = L.polygon([]);
            if (opt) {
                this.setMap(opt.map);
                this.setOptions(opt);
            }
        },

        Circle: function (opt)
        {
            this.initOptions("Circle", opt);
            this.$ = L.circle(this.opt.center || [0, 0], this.opt);
            if (opt) {
                this.setMap(opt.map);
            }
        },

        Rectangle: function (opt)
        {
            this.initOptions("Rectangle", opt);
            this.$ = L.rectangle(this.opt.bounds || [[0,0], [0,0]], this.opt);
            if (opt) {
                this.setMap(opt.map);
            }
        },

        LatLngBounds: function (o)
        {
            if (o && o.getNorth) {
                this.$ = o;
                return;
            }
            this.$ = L.latLngBounds();
            for (var i = 0; i < arguments.length; i++) {
                this.$.extend(tablacus.maps.LLatLng(arguments[i]));
            }
        },

        MarkerImage : function (url, size, origin, anchor, scaledSize)
        {
            this.url = url;
            this.size = scaledSize || size;
            this.origin = origin;
            this.anchor = anchor;
            this.scaledSize = scaledSize;
        },

        ImageMapType: function (opt)
        {
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

        LLatLng: function (latlng, latlng1, p)
        {
            if (latlng) {
                var r = L.latLng(/function/.test(typeof latlng.lat) ? latlng.lat() : latlng.lat || latlng[0] || 0, /function/.test(typeof latlng.lng) ? latlng.lng() : latlng.lng || latlng[1] || 0);
                if (latlng1 && p) {
                    for (dog = 9; dog--;) {
                        d = latlng1.lng - r.lng;
                        if (d > 180) {
                            r.lng += 360;
                            p[0] = true;
                        } else if (d < -180) {
                            r.lng -= 360;
                            p[0] = true;
                        } else {
                            break;
                        }
                    }
                }
                return r;
            }
        },

        LLatLngs: function (latlngs, idl, p)
        {
            var latlng, latlng1, d, r = [];
            if (idl) {
                latlng1 = tablacus.maps.LLatLng(idl);
            }
            for (var i = 0; i < latlngs.length; i++) {
                if (latlngs[i].length && /object/i.test(typeof latlngs[i][0])) {
                    latlng = tablacus.maps.LLatLngs(latlngs[i], idl, p);
                } else {
                    latlng = tablacus.maps.LLatLng(latlngs[i], latlng1, p);
                    latlng1 = latlng;
                }
                r.push(latlng);
            }
            return r;
        },

        LBounds: function (bounds)
        {
            return bounds.$ || [[bounds.south, bounds.west], [bounds.north, bounds.east]];
        },

        layer: {
            getVisible: function ()
            {
                return this.map && this.map.$ ? this.map.$.hasLayer(this.$) : false;
            },
        
            setVisible: function (b)
            {
                if (this.map && this.map.$ && b !== undefined && b != this.getVisible()) {
                    if (b) {
                        this.map.$.addLayer(this.$);
                        try {
                            var layer = this.$, center = this.map.$.getCenter();
                            if (layer.getLatLng && layer.setLatLng) {
                                var p = [false];
                                var latlng = tablacus.maps.LLatLng(layer.getLatLng(), center, p);
                                if (p[0]) {
                                    layer.setLatLng(latlng);
                                }
                            }
                            if (layer.getLatLngs && layer.setLatLngs) {
                                var p = [false];
                                var latlngs = tablacus.maps.LLatLngs(layer.getLatLngs(), center, p);
                                if (p[0]) {
                                    layer.setLatLngs(latlngs);
                                }
                            }
                        } catch (e) {}
                    } else {
                        this.map.$.removeLayer(this.$);
                    }
                }
            },
        
            getMap: function ()
            {
                return this.map;
            },

            setMap: function (map)
            {
                if (this.map && this.map.$) {
                    this.map.$.removeLayer(this.$);
                }
                this.map = map;
                if (map && map.$) {
                    if (this.mapChanged) {
                        this.mapChanged();
                    }
                    this.setVisible(true);
                }
            },

            addListener: function (en, fn)
            {
                tablacus.maps.event.addListener(this, en, fn);
            },

            initOptions: function (mode, opt)
            {
                if (!this.opt) {
                    this.opt = {};
                }
                if (!opt) {
                    return;
                }
                var o = tablacus.maps.alias[mode];
                for (var n in o) {
                    if (opt[n] !== undefined) {
                        var s = o[n] || n;
                        var res = tablacus.maps.alias.re.exec(s);
                        if (res) {
                            if (res[1] == "!") {
                                this.opt[res[2]] = !opt[n];
                            } else if (res[1] == "*") {
                                this.opt[res[2]] = tablacus.maps.LLatLng(opt[n]);
                            } else if (res[1] == "#") {
                                this.opt[res[2]] = tablacus.maps.LBounds(opt[n]);
                            }
                        } else {
                            this.opt[s] = opt[n];
                        }
                    }
                }
            }
        },

        array: {
            forEach: function (fn)
            {
                for (var i = 0; i < this.$.length; i++) {
                    fn(new tablacus.maps.LatLng(this.$[i]));
                }
            },
        
            push: function (v)
            {
                this.$.push(v);
                if (this.callback) {
                    this.callback.notify.call(this.callback, this);
                }
            },
        
            getAt: function (i)
            {
                return new tablacus.maps.LatLng(this.$[i]);
            },

            getLength: function ()
            {
                return this.$.length;
            }
        },

        callback: function ()
        {
            if (window.L) {
                tablacus.maps.Point = L.Point;
                tablacus.maps.Size = L.Point;
                if (/object|function/i.test(typeof window[tablacus.settings.callback])) {
                    return window[tablacus.settings.callback]();
                }
            } else {
                setTimeout(tablacus.maps.callback, 500);
            }
        },

        modifyCss: function ()
        {
            var css = document.styleSheets.item(0);
            try {
                css.insertRule('.leaflet-pane { z-index: 0 !important; }', css.cssRules.length);
                css.insertRule('.leaflet-tile-pane    { z-index: 0 !important; }', css.cssRules.length);
                css.insertRule('.leaflet-overlay-pane { z-index: 1 !important; }', css.cssRules.length);
                css.insertRule('.leaflet-shadow-pane { z-index: 2 !important; }', css.cssRules.length);
                css.insertRule('.leaflet-marker-pane { z-index: 3 !important; }', css.cssRules.length);
                css.insertRule('.leaflet-tooltip-pane { z-index: 4 !important; }', css.cssRules.length);
                css.insertRule('.leaflet-popup-pane { z-index: 5 !important; }', css.cssRules.length);
                css.insertRule('.leaflet-control { z-index: 6 !important; }', css.cssRules.length);
                css.insertRule('.leaflet-top, .leaflet-bottom { z-index: 7 !important; }', css.cssRules.length);
                css.insertRule('.tablacus-label { position: relative; width: 30px; height: 45px }', css.cssRules.length);
                css.insertRule('.tablacus-pin { background-color: #4294CF; width: 28px; height: 28px; text-align: center; vertical-align: middle; border-radius: 20px; color: white; margin: 20px auto; }', css.cssRules.length);
                css.insertRule('.tablacus-pin:after { position: absolute; content: ""; border-top: 15px solid #4294CF; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 0; top: 46px; left: 9px; }', css.cssRules.length); 
                css.insertRule('.tablacus-pin span { line-height: 25px; text-align: center; vertical-align: central; }', css.cssRules.length);
            } catch (e) {}
        },

        alias: {
            re: /^([!\*#$])(.*)/,

            Map: {
                navigationControl: "zoomControl",
                keyboardShortcuts: "keyboard",
                draggable: "dragging",
                disableDoubleClickZoom: "!doubleClickZoom",
                scrollwheel: "scrollWheelZoom",
                disableDefaultUI: "!zoomControl"
            },

            Marker: {
                position: "*position",
                zoom: "zoom",
                draggable: "draggable",
                zIndex: "zIndexOffset"
            },

            InfoWindow: {
                disableAutoPan: "!autoPan",
                maxWidth: "maxWidth",
                minWidth: "minWidth",
                pixelOffset: "offset"
            },

            Polyline: {
                strokeColor: 'color',
                strokeOpacity: 'opacity',
                strokeWeight: 'weight'
            },

            Polygon: {
                strokeColor: "color",
                strokeOpacity: "opacity",
                strokeWeight: "weight",
                fillColor: "fillColor",
                fillOpacity: "fillOpacity"
            },

            Circle: {
                center: "*center",
                radius: "radius",
                strokeColor: "color",
                strokeOpacity: "opacity",
                strokeWeight: "weight",
                fillColor: "fillColor",
                fillOpacity: "fillOpacity"
            },

            Rectangle: {
                bounds: "#bounds",
                strokeColor: "color",
                strokeOpacity: "opacity",
                strokeWeight: "weight",
                fillColor: "fillColor",
                fillOpacity: "fillOpacity"
            },

            set: function (name, opt, $)
            {
                var o = tablacus.maps.alias[name];
                for (var n in o) {
                    if (opt[n] !== undefined) {
                        var s = o[n] || n;
                        var res = tablacus.maps.alias.re.exec(s);
                        if (res) {
                            if (res[1] == "!") {
                                $.options[res[2]] = !opt[n];
                            }
                        } else {
                            $.options[s] = opt[n];
                        }
                    }
                }
                if (opt.map && this.setMap) {
                    this.setMap(opt.map);
                }
            }
        }
    }
};

tablacus.maps.LatLng.prototype = {
    lat: function ()
    {
        return this.$.lat;
    },

    lng: function ()
    {
        return this.$.lng;
    },

    equals: function (latlng)
    {
        return this.$.equals(latlng.$);
    },

    toJSON: function ()
    {
        return this.$;
    },

    toString: function ()
    {
        return "(" + this.lat() + ", " + this.lng() + ")"; 
    },

    toUrlValue: function (i)
    {
        return (this.lat().toFixed(i || 6) - 0) + "," + (this.lng().toFixed(i || 6) - 0); 
    }
}

tablacus.maps.Map.prototype = {
    fitBounds: function (bounds)
    {
        this.$.fitBounds(tablacus.maps.LBounds(bounds));
    },

    getBounds: function ()
    {
        return new tablacus.maps.LatLngBounds(this.$.getBounds());
    },

    getCenter: function ()
    {
        return new tablacus.maps.LatLng(this.$.getCenter());
    },

    getDiv: function ()
    {
        return this.$.getContainer();
    },

    getMapTypeId: function () {},
    getProjection: function ()
    {
        return {
            $: this.$,

            fromLatLngToPoint: function (latlng)
            {
                return this.$.latLngToLayerPoint(tablacus.maps.LLatLng(latlng));
            },

            fromPointToLatLng: function (pt)
            {
                return new tablacus.maps.LatLng(this.$.layerPointToLatLng(pt));
            }
        }
    },

    getStreetView: function () {},
    getTilt: function () {},

    getZoom: function ()
    {
        return this.$.getZoom();
    },

    panBy: function (x, y)
    {
        this.$.panBy([x, y]);
    },

    panTo: function (latlng)
    {
        this.$.panTo(tablacus.maps.LLatLng(latlng));
    },

    setCenter: function (latlng, zoom)
    {
        try {
            this.$.panTo(tablacus.maps.LLatLng(latlng));
        } catch (e) {}
        if (zoom !== undefined) {
            this.setZoom(zoom);
        }
    },

    setOptions: function (opt)
    {
        for (var n in opt) {
            var s = tablacus.maps.alias.Map[n] || n;
            var res = tablacus.maps.alias.re.exec(s);
            if (res) {
                if (res[1] == "!") {
                    this.opt[res[2]] = !opt[n];
                }
            } else {
                this.opt[s] = opt[n];
            }
        }
        if (opt.center) {
            this.opt.center = tablacus.maps.LLatLng(opt.center);
            this.setCenter(this.opt.center);
        }
        if (this.opt.tap === undefined) {
            this.opt.tap = false;
        }
        if (this.$) {
            if (this.opt.zoomControl !== false) {
                this.$.zoomControl.setPosition(this.opt.zoomControlOptions && this.opt.zoomControlOptions.position || this.opt.navigationControlOptions && this.opt.navigationControlOptions.position || "bottomright");
            }
            var o = {
                boxZoom: true,
                doubleClickZoom: true,
                keyboard: true,
                scrollWheelZoom: false,
                dragging: window.ontouchstart !== null,
                touchZoom: true
            };
            for (var n in o) {
                if (this.opt[n] === undefined ? o[n] : this.opt[n]) {
                    this.$[n].enable();
                } else {
                    this.$[n].disable();
                }
            }
            if (this.opt.scaleControl) {
                if (!this.scale) {
                    this.scale = L.control.scale();
                }
                this.scale.addTo(this.$);
            } else if (this.scale) {
                this.scale.remove();
            }
        }
    },

    setMapTypeId: function (id) {},
    setStreetView: function () {},
    setTilt: function () {},

    setZoom: function (zoom)
    {
        this.$.setZoom(zoom);
    },

    addListener: function (en, fn)
    {
        tablacus.maps.event.addListener(this, en, fn);
    }
};

tablacus.maps.Marker.prototype = {
    get: function (n)
    {
        return this[n];
    },

    getPosition: function ()
    {
        return new tablacus.maps.LatLng(this.$.getLatLng());
    },

    setPosition: function (latlng)
    {
        if (latlng) {
            this.$.setLatLng(tablacus.maps.LLatLng(latlng), this.map && this.map.getCenter(), [false]);
        }
    },

    getAnimation: function () {
        return null;
    },

    setAnimation: function () {},

    getIcon: function ()
    {
        return this.icon.$;
    },

    setIcon: function (icon)
    {
        this.icon = {};
        this.setIcon1(icon, "icon");
    },

    setOptions: function (opt)
    {
        if (!opt) {
            return;
        }
        if (opt.title) {
            this.$.bindTooltip(opt.title);
        }
        if (opt.icon) {
            this.setIcon1(opt.icon, "icon");
        }
        if (opt.shadow) {
            this.setIcon1(opt.shadow, "shadow");
        }
        if (opt.label) {
            this.icon.html = '<div class="tablacus-pin"><span>' + opt.label + '</span></div>';
            this.icon.className = "tablacus-label";
            this.icon.iconAnchor = [13, 60],
            this.icon.popupAnchor = [0, -40],
            this.icon.tooltipAnchor = [14, -25]
            this.$.setIcon(L.divIcon(this.icon));
        }
        tablacus.maps.alias.set("Marker", opt, this.$);
        this.setPosition(opt.position);
        this.setVisible(opt.visible);
    },

    setIcon1: function (icon, mode)
    {
        if (mode == "icon") {
            this.icon.$ = icon && /object/i.test(typeof icon) ? icon : { url: icon };
        }
        var o = {};
        if (icon && /object/.test(typeof icon)) {
            o = icon; 
            icon = o.url;
        }
        this.icon[mode + "Url"] = icon;
        if (!icon && mode == "icon") {
            this.$.setIcon(L.Icon.Default.prototype);
            return;
        }
        if (o.size && o.size.x) {
            this.setIcon2(o, mode);
            return;
        }
        var el = new Image();
        el.p = this;
        el.onload = function ()
        {
            o.size = new tablacus.maps.Size(this.naturalWidth, this.naturalHeight);
            this.p.setIcon2(o, mode);         
        }
        el.src = icon;
    },

    setIcon2: function (o, mode)
    {
        if (!o.anchor) {
            o.anchor = new tablacus.maps.Point(o.size.x / 2, o.size.y)
        }
        this.icon[mode + "Size"] = [o.size.x, o.size.y];
        this.icon[mode + "Anchor"] = [o.anchor.x, o.anchor.y];
        if (mode == "icon") {
            this.icon.popupAnchor = [0,  -o.size.y];
            this.icon.tooltipAnchor = [o.size.x / 2, -o.size.y / 2];
        }
        this.$.setIcon(L.icon(this.icon));
    },
};

tablacus.maps.InfoWindow.prototype = {
    open: function (map, opt)
    {
        this.map = map;
        if (opt) {
            if (this.bind) {
                this.close();
            }
            this.bind = opt.$.bindPopup(this.$);
            this.setOptions(opt);
            this.bind.openPopup();
            return;
        }
        if (map && map.$) {
            this.$.openOn(map.$);
        }
    },

    close: function ()
    {
        if (this.bind) {
            this.bind.unbindPopup();
            delete this.bind;
        }
        if (this.map) {
            this.map.$.closePopup(this.$);
        }
    },

    setPosition: function (latlng)
    {
        this.$.setLatLng(tablacus.maps.LLatLng(latlng), this.map && this.map.getCenter(), [false]);
    },

    setContent: function (content)
    {
        this.$.setContent(content);
    },

    setOptions: function (opt)
    {
        this.$.options.autoClose = false;
        this.$.options.closeOnClick = false;
        if (!opt) {
            return;
        }
        if (opt.content) {
            this.$.setContent(opt.content);
        }
        if (opt.position) {
            this.setPosition(opt.position);
        }
        tablacus.maps.alias.set("InfoWindow", opt, this.$);
    }
};

tablacus.maps.Polyline.prototype = {
    getPath: function ()
    {
        return new tablacus.maps.LatLngs(this.$.getLatLngs(), this);
    },

    setOptions: function (opt)
    {
        if (opt.path) {
            var p = [false];
            var latlngs = tablacus.maps.LLatLngs(opt.path, this.map && this.map.getCenter(), p);
            this.$.setLatLngs(latlngs);
        }
        tablacus.maps.alias.set("Polyline", opt, this.$);
    },

    notify: function (latlngs)
    {
        this.setOptions({ path: latlngs.$ });
    },

    mapChanged: function ()
    {
        var p = [false];
        var latlngs = tablacus.maps.LLatLngs(this.$.getLatLngs(), this.map.getCenter(), p);
        if (p[0]) {
            this.$.setLatLngs(latlngs);
        }
    }
}

tablacus.maps.Polygon.prototype = {
    getPath: function ()
    {
        return new tablacus.maps.LatLngs(this.$.getLatLngs()[0], this);
    },

    getPaths: function ()
    {
        var r = [];
        var o = this.$.getLatLngs();
        for (var i = 0; i < o.length; i++) {
            r.push(new tablacus.maps.LatLngs(o[i]));
        }
        return r;
    },

    setOptions: function (opt)
    {
        if (opt.paths) {
            var p = [false];
            var latlngs = tablacus.maps.LLatLngs(opt.paths, this.map && this.map.getCenter(), p);
            this.$.setLatLngs(latlngs);
        }
        tablacus.maps.alias.set("Polygon", opt, this.$);
    },

    mapChanged: function ()
    {
        var p = [false];
        var latlngs = tablacus.maps.LLatLngs(this.$.getLatLngs(), this.map.getCenter(), p);
        if (p[0]) {
            this.$.setLatLngs(latlngs);
        }
    }
}

tablacus.maps.Circle.prototype = {
    setOptions: function (opt)
    {
        if (opt.center) {
            this.$.setLatLng(tablacus.maps.LLatLng(opt.center), this.map && this.map.getCenter(), [false]);
        }
        tablacus.maps.alias.set("Circle", opt, this.$);
    }
}

tablacus.maps.Rectangle.prototype = {
    setOptions: function (opt)
    {
        if (opt.bounds) {
            this.$.setBounds(tablacus.maps.LBounds(opt.bounds))
        }
        tablacus.maps.alias.set("Rectangle", opt, this.$);
        if (opt.map) {
            this.setMap(opt.map);
        }
    }
}

tablacus.maps.LatLngBounds.prototype.extend = function (latlng)
{
    this.$.extend(tablacus.maps.LLatLng(latlng));
};

tablacus.maps.Geocoder.prototype.geocode = function (opt, callback)
{
    var url, xhr = new XMLHttpRequest();
    if (opt.address) {
        url = tablacus.settings.geocoder + encodeURIComponent(opt.address);
        xhr.onload = function() 
        { 
            var r = [];
            var xml = xhr.responseXML.getElementsByTagName("place");
            for (var i = 0; i < xml.length; i++) {
                var o = { 
                    geometry: {
                        location: new tablacus.maps.LatLng(xml[i].getAttribute("lat"), xml[i].getAttribute("lon"), true)
                    },
                    formatted_address: xml[i].getAttribute("display_name"),
                    address_components: []
                }
                r.push(o);
            }
            callback(r, r.length ? tablacus.maps.GeocoderStatus.OK : tablacus.maps.GeocoderStatus.ZERO_RESULTS);
        }
    } else if (opt.location) {
        var latlng = tablacus.maps.LLatLng(opt.location);
        url = tablacus.settings.reverse.replace(/{lat}/g, encodeURIComponent(latlng.lat)).replace(/{lng}/g, encodeURIComponent(latlng.lng));
        xhr.onload = function() 
        { 
            var r = [];
            var xml = xhr.responseXML.getElementsByTagName("result");
            for (var i = 0; i < xml.length; i++) {
                var o = { 
                    geometry: {
                        location: new tablacus.maps.LatLng(xml[i].getAttribute("lat"), xml[i].getAttribute("lon"), true)
                    },
                    formatted_address: xml[i].textContent || xml[i].text,
                    address_components: []
                }
                r.push(o);
            }
            callback(r, r.length ? tablacus.maps.GeocoderStatus.OK : tablacus.maps.GeocoderStatus.ZERO_RESULTS);
        }
    }
    xhr.open("GET", url, true);
    xhr.send(null);
};

(function ()
{
    for (var n in tablacus.maps.layer) {
        var v = tablacus.maps.layer[n];
        tablacus.maps.Marker.prototype[n] = v;
        tablacus.maps.InfoWindow.prototype[n] = v;
        tablacus.maps.Polyline.prototype[n] = v;
        tablacus.maps.Polygon.prototype[n] = v;
        tablacus.maps.Circle.prototype[n] = v;
        tablacus.maps.Rectangle.prototype[n] = v;
    }
    
    for (var n in tablacus.maps.array) {
        tablacus.maps.LatLngs.prototype[n] = tablacus.maps.array[n];
    }

    var query, res;
    var loaded = window.L ? true : false;
    var re = /tablacusmapsapi\.(js|php)\?(.*)|tablacusmapsapi\.(js|php)$/;
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
        var src = scripts[i].src;
        if (res = re.exec(src)) {
            query = res[2];
        }
        loaded |= /leaflet\.js$/.test(src);
    }
    //<?= "\n            query = '" . $_SERVER['QUERY_STRING'] . "';\n"; ?>
    if (query) {
        var param = query.split('&');
        for(var j = param.length; j--;) {
            var el = param[j].split('=');
            tablacus.settings[decodeURIComponent(el[0])] = decodeURIComponent(el[1]);
        }
    }
    if (tablacus.settings.alias) {
        if (!window[tablacus.settings.alias]) {
            window[tablacus.settings.alias] = {};
        }
        window[tablacus.settings.alias].maps = tablacus.maps;
    }
    if (loaded) {
        tablacus.maps.modifyCss();
        tablacus.maps.callback();
    } else {
        var head = document.getElementsByTagName("head")[0];
        el = document.createElement("link");
        el.rel = "stylesheet";
        el.href = tablacus.settings.leafletcss;
        el.type = "text/css";
        el.onload = tablacus.maps.modifyCss;
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
            tablacus.maps.callback();
        }
    }
})();
