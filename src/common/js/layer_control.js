module.exports = function(cMap) {

    //define labels layer
    var mblabels = L.mapbox.tileLayer('statecodemog.798453f5', {
        'clickable': 'false',
        'zIndex': 1000
    });
    
    // var munibounds = L.mapbox.feature('cjthelhtl01fg32pd2gcjfuc9', {
    //     'clickable': 'false'
    // });
    
    var munibounds = new L.geoJson();
    var county = new L.geoJson();
    
    $.ajax({
        dataType: "json",
        //url: "https://gis.dola.colorado.gov/munis/munis",
        url: "https://storage.googleapis.com/co-publicdata/munibounds.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                munibounds.addData(data);
            });
            munibounds.setStyle({color: '#000000', opacity: 1.0, fillColor: '#ffffff', fillOpacity: 0.1});
        }
        }).error(function() {});
        
    $.ajax({
        dataType: "json",
        url: "https://storage.googleapis.com/co-publicdata/counties.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                county.addData(data);
            });
            county.setStyle({color: '#555555', opacity: 1.0, fillColor: '#ffffff', fillOpacity: 0.1});
        }
        }).error(function() {});
    
    //create map sandwich
    var topPane = cMap.map._createPane('leaflet-top-pane', cMap.map.getPanes().mapPane);
    var topLayer = mblabels.addTo(cMap.map);
    topPane.appendChild(topLayer.getContainer());


    var baseLayers = {
        "Mapbox: Contrast": cMap.mbsat,
        "ESRI Streets": cMap.mbstyle
    };

    cMap.map.addLayer(county);

    //in the future ill figure out how to toggle labels on and off (and still have it appear on top)
    var groupedOverlays = {
        "Municipal Boundaries": munibounds,
        "Counties": county
    };

    //add layer control
    L.control.layers(baseLayers, groupedOverlays, {
        'autoZIndex': false
    }).addTo(cMap.map);

}