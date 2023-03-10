const searchInput = document.querySelector('.search-input');
const searchResults = document.querySelector('#search-results');


//---------Background-------//
var map = L.map('map').setView([15, 180], 2);

var tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 25,
    minZoom: 2,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//---------Borderline-For-Pan-And-Zoom-------//

var southWest = L.latLng(-90, -180),
northEast = L.latLng(90, 180);
var bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
map.on('drag', function() { map.panInsideBounds(bounds, { animate: false });});

//---------Color-------//

function style(feature) {
    return {
        fillColor: 'transparent',
        weight: 0.8,
        opacity: 1,
        color: '#e9e9e9'
        
    };
}

//---------Highlight-While-Hovering-------//
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1.5,
        color: 'darkred',
        fillColor: 'red',
        fillOpacity: 0.5
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {

    layer.bringToFront();
    info.update(layer.feature.properties);}
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());

    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: 'black',
        fillColor: 'red',
        fillOpacity: 0.2
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
        info.update(layer.feature.properties);
    }

  }

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: function (e) {
            highlightFeature(e);
            info.update(e.target.feature.properties);
        },
        mouseout: function (e) {
            resetHighlight(e);
            info.update();
        }
    });
}

geojson = L.geoJson(countriesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

//---------Ass-JSON-Data-------//

/*
fetch("./World_countries.geojson")
    .then(data => data.json())
    .then(geojson => {
        var geojsonLayer = L.geoJson(geojson, {style: style,onEachFeature: onEachFeature}).addTo(map);
        window.geojson = geojsonLayer;
    })
*/
//---------Information-------//

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h3>Countries</h3>' + '<h4>Details</h4>' + (props ?
        '<table><tr><td>Name:</td><td><b>' + props.NAME + '</b></td></tr>' +
        '<tr><td>Country:</td><td>' + props.SOVEREIGNT + '</td></tr>' + 
        '<tr><td>Continent:</td><td>' + props.CONTINENT + '</td></tr>' + 
        '<tr><td>Area:</td><td>' + props.AREA + ' km<sup>2</sup></td></tr>' +
        '<tr><td>Population:</td><td>' + props.POP_EST + '</td></tr></table>'
        : 'Hover over a state');};

info.addTo(map);

//---------SuchFeld-------//
searchInput.addEventListener("input", (event) => {
    console.dir(event.target)
    if (searchInput.value ==="") {
        searchResults.innerHTML = "";
        searchResults.style.display = "none";
        searchName = null;
        return;
    }

    const matches = search(); 
    //console.log(matches);
    searchResults.innerHTML = "";
    if (matches.length > 0) {
        let ul = document.createElement("ul");
        for (let name of matches) {
            let li = document.createElement("li");
            li.innerText = name;
            li.addEventListener("click", () => {
                searchInput.value = name;
                searchResults.style.display = "none";
                highlightCountry(name.toLowerCase());

            });
            ul.appendChild(li);
        }

        searchResults.appendChild(ul);
        searchResults.style.display = "flex";
    }

    else {
        searchResults.style.display = "none";
    }

});



function highlightCountry(countryName) {
    for (let key in geojson._layers) {
        const layer = geojson._layers[key]
        if (layer.feature.properties.NAME.toLowerCase() === countryName) {
            console.log("treffer!");
            layer.setStyle({
                weight: 2,
                color: '#4e0556',
                fillColor: '#740780',
                fillOpacity: 0.5
            })
        }
    }
};

function search(){
    let searchValue = searchInput.value.toLowerCase();
    let matches = [];
    for (let country of countriesData.features) { 
        const name = country.properties.NAME;
        if (name.toLowerCase().startsWith(searchValue)) {
            matches.push(name);
        }
    }
    return matches;
}

//-------change-Maps---------------------------------
const basemaps = { 
    StreetView: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',   {maxZoom: 25, minZoom: 2, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),
    Topography: L.tileLayer.wms('http://ows.mundialis.de/services/service?',   {maxZoom: 25, minZoom: 2, layers: 'TOPO-WMS'}),
    Satellite: L.tileLayer.wms('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', {maxZoom: 25, minZoom: 2, layers: 'OSM-Overlay-WMS'})
  };

L.control.layers(basemaps).addTo(map);
