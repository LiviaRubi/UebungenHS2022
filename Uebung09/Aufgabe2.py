import uvicorn
from fastapi import FastAPI
import pyproj

app = FastAPI()
g = pyproj.Geod(ellps="WGS84")

@app.get("/geodetic/&")
async def line (startlong: float, startlat: float, endlong: float, endlat: float):
    lonlats = g.npts(startlong, startlat, endlong, endlat, 30)
    lonlats = [[startlong, startlat]] + [list(i) for i in lonlats] + [[endlong, endlat]] 

    geojson = f"""{{
        "type": "Feature",
        "geometry": {{
            "type": "MultiPoint",
            "coordinates": {lonlats}
        }},
        "properties": {{
            "info": "geodätische Linie"
            }}
        }}
        """
    return geojson

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8002, root_path="/geodetic")

# Link aufrufen: vm25.sourcelab.ch/geodetic/&...