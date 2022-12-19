import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Grid, Button, TextField, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import axios from "axios";

//->nur Orthofoto stürzt ab...
//Buttons in der Mitte?
//Autoren??

function App() {
  const [data, setData] = useState(null);
  const [ortho, setOrtho] = useState(null);
  const [transform, setTrans] = useState(null);
  const [posnew, setNew] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState([47.536, 7.643]);

  const url =`https://vm13.sourcelab.ch/antipodes?lat=${position[0]}&lng=${position[1]}`

//------------------- Karte -------------------------------------------------------------
  useEffect(() => {
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
    },[]);

//-----------------Antipode anzeigen (für Button "View Antipode") ------------------------------------
  function antipode() {

    setLoading(true);
      axios
        .get(url)
        .then((response) => {
          setTrans(response.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    console.log(transform);

//-------- Koordinaten umrechnen (für Button "Calculate Coordinates") ---------------------
  function umrechnen() {
    
    setLoading(true);
      axios
        .get(url)
        .then((response) => {
          setNew(response.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    console.log(posnew);

//------------------- Punkt anzeigen (für Button "View Point") ----------------------------
  function point() {

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
  console.log(data);

//------------------- Orthofoto -----------------------------------------------------------
  function orthofoto() {

    setLoading(true);
      axios
        .get(url)
        .then((response) => {
          setOrtho(response.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
  }
  console.log(ortho);

//------------------- Map Position aktualisieren ------------------------------------------
  function FlyMapTo() {

    const map = useMap()
    useEffect(() => {
        map.flyTo(position)
    },)
    return null
  }

  function FlyMapToAntipode() {

    const map = useMap()
    useEffect(() => {
        map.flyTo(transform?.geometry.coordinates)
    },)
    return null
}

//----------- Design: GUI (mit Buttons, Textfields und Maps) ------------------------------
  return (
    <>
      <AppBar position="sticky" sx={{backgroundColor: "black", p:2, display:"grid", gridTemplateColumns: "1fr 1fr 1fr 1fr"}} align="center">
        <Toolbar align="center">
          <Grid item xs={12} align="center" sx={{display:'flex', alignItems:"center", justifyContent:"center"}}>
            <Button variant="outlined" sx={{color: 'white', backgroundColor: 'none', borderColor: 'white', mr:4, gridColumn:1}} onClick={() => {umrechnen()}}>Calculate Coordinates</Button>
            <Button variant="outlined" sx={{color: 'white', backgroundColor: 'none', borderColor: 'white', mr:4, gridColumn:2}} onClick={ () => {point()}}>View Point</Button>
            <Button variant="outlined" sx={{color: 'white', backgroundColor: 'none', borderColor: 'white', mr:4, gridColumn:3}} onClick={ () => {antipode()}}>View Antipode</Button>
            <Button variant="outlined" sx={{color: 'white', backgroundColor: 'none', borderColor: 'white', mr:4, gridColumn:4}} onClick={ () => {orthofoto()}}>View Orthofoto</Button>
          </Grid>
        </Toolbar>
      </AppBar>

      <Typography variant='h3' align='center' sx={{m:5}}>Antipode</Typography>
      <Grid container spacing={2} sx={{mb:2}}>
        <Grid item xs={12} align="center">
          <TextField label="Breite" variant="outlined" sx={{mr:5}} type={"number"} defaultValue={position[0]} onChange={(event) => {var lng = position[1]; setPosition([event.target.value, lng])}}/> 
          <TextField label="Länge" variant="outlined" type={"number"} defaultValue={position[1]} onChange={(event) => {var lat = position[0]; setPosition([lat, event.target.value])}}/>
        </Grid>
      </Grid>

      {posnew &&
        <>
          <Grid align="center" sx={{mt:5}}>
            <Typography variant='h5' align='center' sx={{mb:1}}>Koordinaten des Antipodes:</Typography>
            <Typography>Breite: {posnew?.geometry.coordinates[0]}</Typography>
            <Typography>Länge: {posnew?.geometry.coordinates[1]}</Typography>
          </Grid>
        </>
      }

      {loading &&
          <Typography align='center'>API Aufruf, bitte warten!</Typography>
      }

      {error &&
        <>
          <Typography align='center'>ERROR API Aufruf fehlgeschlagen</Typography>{console.log(error)}<br/>
        </>
      }

      <Grid sx={{mt:5, ml:1, mr:1, display:"grid", gridTemplateColumns:"48%"}}>
        {data &&
          <>
            <Typography sx={{display:"flex", gridColumn:1, alignItems:"center", justifyContent:"center"}} variant='h5'>Position der Ursprungskoordinaten</Typography>
          </>
        }

        {transform &&
          <Typography sx={{display:"flex", gridColumn:2, alignItems:"center", justifyContent:"center"}} variant='h5'>Position des Antipodes</Typography>
        }
      </Grid>

      {data &&
        <>
          <MapContainer className="map" center={position} zoom={2} scrollWheelZoom={true} style={{height: "400px", width: "48%", float:"left", margin:"10px"}}>
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
            <Marker position={ position }>
              <Popup>{position[0]}<br/>{position[1]}</Popup>
            </Marker>
            <FlyMapTo/>
          </MapContainer>
        </>
      }

      {transform &&
        <>
          <MapContainer center={transform?.geometry.coordinates} zoom={2} scrollWheelZoom={true} style={{height: "400px", width: "48%", float:"right", margin:"10px"}}>
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
            <Marker position={transform?.geometry.coordinates}>
              <Popup>{posnew?.geometry.coordinates[0]}<br/>{posnew?.geometry.coordinates[1]}</Popup>
            </Marker>
            <FlyMapToAntipode/>
          </MapContainer>
        </>
      }

      {ortho &&
        <>
          <MapContainer center={position} zoom={10} scrollWheelZoom={true} style={{height: "400px", width: "48%", float:"left", margin:"10px"}}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; swisstopo"/>
            <Marker position={position}>
              <Popup>{position[0]}<br/>{position[1]}</Popup>
            </Marker>
            <FlyMapTo/>
          </MapContainer>

          <MapContainer center={transform?.geometry.coordinates} zoom={10} scrollWheelZoom={true} style={{height: "400px", width: "48%", float:"right", margin:"10px"}}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; swisstopo"/>
            <Marker position={transform?.geometry.coordinates}>
              <Popup>{posnew?.geometry.coordinates[0]}<br/>{posnew?.geometry.coordinates[1]}</Popup>
            </Marker>
            <FlyMapToAntipode/>
          </MapContainer>
        </>
      }
    </>
  );
}

export default App;