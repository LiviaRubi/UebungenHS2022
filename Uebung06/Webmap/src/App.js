import React from 'react';
import "./App.css";
import "leaflet/dist/leaflet.css";


import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'


function App() {

  React.useEffect(() => {
    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
  }, []);

  const kraftwerk = [
    {
      pos: [47.36580, 7.96671],
      bau: "01.12.1973 - 01.02.1979",
      kkw: "Gösgen"},
    {
      pos: [46.96894, 7.26682],
      bau: "01.03.1967 - 30.06.1971",
      kkw: "Mühleberg"},
    {
      pos: [47.60215, 8.18185],
      bau: "01.01.1974 - 23.05.1984",
      kkw: "Leibstadt"},
    {
      pos: [47.55148, 8.22896],
      bau: "01.09.1965 - 22.10.1971",
      kkw: "Beznau"}
    ]

  const circlestyle = {color: "darkturquoise", weight:3}

return (
  <MapContainer center={[47.01579, 8.10788]} zoom={8} scrollWheelZoom={true}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></TileLayer>


  <TileLayer url="https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg"
	  attribution="&copy; swisstopo">
    </TileLayer>

  <Circle radius={50000} pathOptions={circlestyle} center={kraftwerk[0].pos}></Circle>
  <Circle radius={50000} pathOptions={circlestyle} center={kraftwerk[1].pos}></Circle>
  <Circle radius={50000} pathOptions={circlestyle} center={kraftwerk[2].pos}></Circle>
  <Circle radius={50000} pathOptions={circlestyle} center={kraftwerk[3].pos}></Circle>


  <Marker position={kraftwerk[0].pos}>
    <Popup>
      <h2>Kernkraftwerk {kraftwerk[0].kkw}</h2><br/><b>Bauphase:</b> {kraftwerk[0].bau}
    </Popup>
  </Marker>

  <Marker position={kraftwerk[1].pos}>
    <Popup>
      <h2>Kernkraftwerk {kraftwerk[1].kkw}</h2><br/><b>Bauphase:</b> {kraftwerk[1].bau}
    </Popup>
  </Marker>

  <Marker position={kraftwerk[2].pos}>
    <Popup>
      <h2>Kernkraftwerk {kraftwerk[2].kkw}</h2><br/><b>Bauphase:</b> {kraftwerk[2].bau}
    </Popup>
  </Marker>

  <Marker position={kraftwerk[3].pos}>
    <Popup>
      <h2>Kernkraftwerk {kraftwerk[3].kkw}</h2><br/><b>Bauphase:</b> {kraftwerk[3].bau}
    </Popup>
  </Marker>

</MapContainer>
  );
}

export default App;
