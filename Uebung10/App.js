import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import axios from "axios";

import 'leaflet/dist/leaflet.css';


function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [startlat, setsLatitude] = useState(47.5349);
  const [startlng, setsLontigude] = useState(7.6417);
  const [endlat, seteLatitude] = useState(8.9738);
  const [endlng, seteLontigude] = useState(-79.506);
  const [point, setPoints] = useState(100);
  const [startpos, setsPos] = useState([47.536, 7.643]);
  const [endpos, setePos] = useState([8.9738, -79.506]);


  useEffect(() => {
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
    }, []);

  function do_download() {
    // TODO: Parametrisieren
    var url = `https://vm1.sourcelab.ch/geodetic/line?startlat=${startpos[0]}&startlng=${startpos[1]}&endlat=${endpos[0]}&endlng=${endpos[1]}&pts=${point}`;

    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <h1>Geodetic Line</h1>
      <h3>Startkoordinaten</h3>
      <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Start-Breite" variant="filled" defaultValue={startpos[0]} 
                       onChange={ (event) => { var lng = startpos[1]; setsPos([event.target.value, lng]) } }/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Start-Länge" variant="filled" defaultValue={startpos[1]}
                       onChange={ (event) => { var lat = startpos[0]; setsPos([lat, event.target.value]) } }/>
          </Grid>
          <Grid item xs={12}>
          <h3>Endkoordinaten</h3>
            <TextField label="End-Breite" variant="filled" defaultValue={endpos[0]} 
                       onChange={ (event) => { var lng = endpos[1]; setePos([event.target.value, lng]) } }/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="End-Länge" variant="filled" defaultValue={endpos[1]}
                       onChange={ (event) => { var lat = endpos[0]; setePos([lat, event.target.value]) } }/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Anzahl Punkte" variant="outlined" defaultValue={point} 
                        onChange={ (event) => {setPoints(event.target.value) } }/>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="warning" onClick={ () => {do_download() } }>New Path</Button>
          </Grid>
        </Grid>

      {loading && <>
                     <div>API Aufruf, bitte warten!</div><br/>
                  </>
      }

      {error &&   <>
                     <div>ERROR API Aufruf fehlgeschlagen</div>{console.log(error)}<br/>
                  </>}

      {data &&  <>
                  <MapContainer center={startpos} zoom={2} scrollWheelZoom={true}
                    style={{ height: "600px", width: "100%", margin:"10px"}} >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                  <GeoJSON data={data} style={{ weight: 8, opacity: '30%', color: 'green'}}/>
                  </MapContainer>
                </>}
  
      </>
  );
}

export default App;
