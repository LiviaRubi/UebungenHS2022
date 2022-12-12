import uvicorn
from fastapi import FastAPI
from pyproj import Transformer

app = FastAPI()

transformer1 = Transformer.from_crs("epsg:4326", "epsg:2056")
transformer2 = Transformer.from_crs("epsg:2056", "epsg:4326")


@app.get("/transform/wgs84lv95")
async def transform(lat: float, lng: float):
    r1 = transformer1.transform(lng, lat)
    return f"""east: {r1[0]}; north: {r1[1]}"""

@app.get("/transform/lv95wgs84")
async def transform(east: float, north: float):
    r2 = transformer2.transform(east, north)
    return f"""lng: {r2[0]}; lat: {r2[1]}"""

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001, root_path="/transform")


# aufrufen Link: vm25.sourcelab.ch/transform/wgs84lv95?lng=0.0000&lat=0.0000
