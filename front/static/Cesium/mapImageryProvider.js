function createGoogleMaps(Cesium, options) {
    function GMImageryProvider(options) {
        this._url = "http://localhost:6080/arcgis/rest/services/shenzhensafe4/MapServer/tile/{level}/{x}/{y}";

        this._key = options.key;//;
        this._tilingScheme = new Cesium.WebMercatorTilingScheme();

        this._tileWidth = 256;
        this._tileHeight = 256;
        //this._minimumLevel = 10
        this._maximumLevel = 16;

        // this._year = options.year;

        this._credit = undefined;
        //this._rectangle = new Cesium.Rectangle.fromDegrees(113.70222699999999, 22.322220999999999, 114.65777799999999, 22.854454); //this._tilingScheme.rectangle;
		this._rectangle = new Cesium.Rectangle.fromDegrees(119.531250000000000, 29.531250000000000, 122.343750000000000, 32.343750000000000);
        this._ready = true;
    }

    function buildImageUrl(imageryProvider, x, y, level) {
        // var rectangle = imageryProvider._tilingScheme.tileXYToNativeRectangle(x, y, level);

        // var dWidth = rectangle.west + (rectangle.east - rectangle.west) / 2;
        // var dHeight = rectangle.south + (rectangle.north - rectangle.south) / 2;

        // var projection = imageryProvider._tilingScheme._projection;
        // var centre = projection.unproject(new Cesium.Cartesian2(dWidth, dHeight));

        // var url = imageryProvider._url
        //     .replace('{x}', y)//centre.longitude * 180 / Math.PI)
        //     .replace('{y}', x)//centre.latitude * 180 / Math.PI)
        //     .replace('{key}', imageryProvider._key)
        //     .replace('{level}', level);
        if (imageryProvider._key == '1') {
            var a = "L" + pad(level.toString(), 2, '0') + "/" +
            "R" + pad(y.toString(16), 8, '0').toLocaleUpperCase() + "/" +
            "C" + pad(x.toString(16), 8, '0').toLocaleUpperCase() + "." + "png";

            url = "/static/shanghai/_alllayers/" + a;
        
		// url = "http://101.231.110.42:5026/arcgisserverlayer/2000/_alllayers/" + a;

            return url;
        } 
        else if (imageryProvider._key == '2') {
            var a = "L" + pad(level.toString(), 2, '0') + "/" +
            "R" + pad(y.toString(16), 8, '0').toLocaleUpperCase() + "/" +
            "C" + pad(x.toString(16), 8, '0').toLocaleUpperCase() + "." + "png";

            url = "/static/map/_alllayers/" + a;

            return url;
        }

    }

    Cesium.defineProperties(GMImageryProvider.prototype, {
        url: {
            get: function () {
                return this._url;
            }
        },

        token: {
            get: function () {
                return this._token;
            }
        },

        proxy: {
            get: function () {
                return this._proxy;
            }
        },

        tileWidth: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tileWidth must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tileWidth;
            }
        },

        tileHeight: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tileHeight must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tileHeight;
            }
        },

        maximumLevel: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._maximumLevel;
            }
        },

        minimumLevel: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return 0;
            }
        },

        tilingScheme: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tilingScheme;
            }
        },

        rectangle: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('rectangle must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._rectangle;
            }
        },

        tileDiscardPolicy: {
            get: function () {
                //>>includeStart('debug', pragmas.debug);
                if (!this._ready) {
                    throw new DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.');
                }
                //>>includeEnd('debug');

                return this._tileDiscardPolicy;
            }
        },

        errorEvent: {
            get: function () {
                return this._errorEvent;
            }
        },

        ready: {
            get: function () {
                return this._ready;
            }
        },

        readyPromise: {
            get: function () {
                return this._readyPromise.promise;
            }
        },

        credit: {
            get: function () {
                return this._credit;
            }
        },

        usingPrecachedTiles: {
            get: function () {
                return this._useTiles;
            }
        },

        hasAlphaChannel: {
            get: function () {
                return true;
            }
        },

        layers: {
            get: function () {
                return this._layers;
            }
        }
    });

    GMImageryProvider.prototype.getTileCredits = function (x, y, level) {
        return undefined;
    };

    GMImageryProvider.prototype.requestImage = function (x, y, level) {
        if (!this._ready) {
            throw new DeveloperError('requestImage must not be called before the imagery provider is ready.');
        }

        var url = buildImageUrl(this, x, y, level);
        return Cesium.ImageryProvider.loadImage(this, url);
    };

    return new GMImageryProvider(options);
}

function pad(string16, _index, _String) {
    var a = string16.length;
    var index = _index;
    var string = _String;
        if (a == index) {
            return string16;
        }
        if (a < index) {
            var b = index - a;
            var c = "";
            for (var i = 0; i < b; i++) {
                c += string;
            }
            return c + string16;
        }
};