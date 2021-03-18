define(['dojo/_base/declare', 'jimu/BaseWidget', "esri/tasks/QueryTask", "esri/tasks/query", 'dojo/_base/lang', "esri/graphic", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/SpatialReference"], function (declare, BaseWidget, QueryTask, Query, lang, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color, SpatialReference) {
      //To create a widget, you need to derive from BaseWidget.
      return declare([BaseWidget], {

            // Custom widget code goes here

            baseClass: 'parroquias-galicia',
            // this property is set by the framework when widget is loaded.
            // name: 'ParroquiasGalicia',
            // add additional properties here

            cargaConcellos: function cargaConcellos() {

                  // Recogemos el código de provincias seleccionado
                  var codigoProvincia = this.selectProvincia.value;
                  if (codigoProvincia == -1) return;

                  // Limpiamos el combo de concellos
                  this.selectConcellos.innerHTML = "";

                  // Cogemos la URL del fichero de configuracion
                  var queryTask = new QueryTask(this.config.servicioConcellos);

                  // Establecemos los parametros correctos para ejecutar la consulta
                  var query = new Query();
                  query.returnGeometry = false;
                  query.outFields = ["CODCONC", "CONCELLO"];
                  query.orderByFields = ["CONCELLO"];
                  query.where = "CODPROV = " + codigoProvincia;

                  // Ejecutamos la consulta
                  queryTask.execute(query, lang.hitch(this, function (results) {

                        // Creamos la opción por defecto (-1)
                        var opt = document.createElement("option");
                        opt.value = -1;
                        opt.text = "Seleccione concello";
                        this.selectConcellos.add(opt);

                        // Para cada concello creamos la option correspondiente en el combo según la consulta
                        for (var i = 0; i < results.features.length; i++) {
                              opt = document.createElement("option");
                              opt.value = results.features[i].attributes.CODCONC;
                              opt.text = results.features[i].attributes.CONCELLO;
                              this.selectConcellos.add(opt);
                        }
                  }));
            },
            cargaParroquias: function cargaParroquias() {
                  // Recogemos el código de provincias seleccionado
                  var codigoConcello = this.selectConcellos.value;
                  if (codigoConcello == -1) return;

                  // Limpiamos el combo de concellos
                  this.selectParroquias.innerHTML = "";

                  // Cogemos la URL del fichero de configuracion
                  var queryTask = new QueryTask(this.config.servicioParroquias);

                  // Establecemos los parametros correctos para ejecutar la consulta
                  var query = new Query();
                  query.returnGeometry = false;
                  query.outFields = ["CODPARRO", "PARROQUIA"];
                  query.orderByFields = ["PARROQUIA"];
                  query.where = "CODCONC = " + codigoConcello;

                  // Ejecutamos la consulta
                  queryTask.execute(query, lang.hitch(this, function (results_parr) {

                        // Creamos la opción por defecto (-1)
                        var opt = document.createElement("option");
                        opt.value = -1;
                        opt.text = "Seleccione parroquia";
                        this.selectParroquias.add(opt);

                        // Para cada concello creamos la option correspondiente en el combo según la consulta
                        for (var i = 0; i < results_parr.features.length; i++) {
                              opt = document.createElement("option");
                              opt.value = results_parr.features[i].attributes.CODPARRO;
                              opt.text = results_parr.features[i].attributes.PARROQUIA;
                              this.selectParroquias.add(opt);
                        }
                  }));
            },
            zoomConcello: function zoomConcello() {

                  // Recogemos el código de provincias seleccionado
                  var codigoConcello = this.selectConcellos.value;
                  if (codigoConcello == -1) return;

                  // Cogemos la URL del fichero de configuracion
                  var queryTaskZoomConcello = new QueryTask(this.config.servicioConcellos);

                  // Establecemos los parametros correctos para ejecutar la consulta
                  var queryConcello = new Query();
                  queryConcello.returnGeometry = true;
                  queryConcello.outSpatialReference = new SpatialReference(102100);
                  queryConcello.where = "CODCONC = " + codigoConcello;

                  // Ejecutamos la consulta
                  queryTaskZoomConcello.execute(queryConcello, lang.hitch(this, function (resultZoomCon) {

                        // Recogemos la geometría 
                        var geometriaCon = resultZoomCon.features[0].geometry;

                        // Damos una simbología
                        var polygonSymbol = new SimpleFillSymbol("solid", new SimpleLineSymbol("solid", new Color([232, 104, 80]), 2), new Color([232, 104, 80, 0.25]));

                        var graphicConcello = new Graphic(geometriaCon, polygonSymbol);

                        this.map.graphics.add(graphicConcello);
                        this.map.setExtent(geometriaCon.getExtent(), true);
                  }));

                  console.log("Los has hecho bien");
            },
            zoomParroquia: function zoomParroquia() {
                  var codigoParroquia = this.selectParroquias.value;
                  if (codigoParroquia == -1) return;

                  // Cogemos la URL del fichero de configuracion
                  var queryTaskZoomParroquia = new QueryTask(this.config.servicioParroquias);

                  // Establecemos los parametros correctos para ejecutar la consulta
                  var queryConcello = new Query();
                  queryConcello.returnGeometry = true;
                  queryConcello.outSpatialReference = new SpatialReference(102100);
                  queryConcello.where = "CODPARRO = " + codigoParroquia;

                  // Ejecutamos la consulta
                  queryTaskZoomParroquia.execute(queryConcello, lang.hitch(this, function (resultZoomCon) {

                        // Recogemos la geometría 
                        var geometriaPar = resultZoomCon.features[0].geometry;

                        // Damos una simbología
                        var polygonSymbol = new SimpleFillSymbol("solid", new SimpleLineSymbol("solid", new Color([232, 104, 80]), 2), new Color([232, 104, 80, 0.25]));

                        var graphicParroquia = new Graphic(geometriaPar, polygonSymbol);

                        this.map.graphics.add(graphicParroquia);
                        this.map.setExtent(geometriaPar.getExtent(), true);
                  }));
            }
      });
});
//# sourceMappingURL=Widget.js.map
