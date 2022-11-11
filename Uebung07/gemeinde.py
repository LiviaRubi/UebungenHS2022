import uvicorn
from fastapi import FastAPI

app = FastAPI()

d = {}
file = open("PLZO_CSV_LV95.csv", encoding="utf-8")
next(file)

for line in file:
    data = line.strip().split(";")
    ortschaft = data[0]
    zip = data[1]
    gemeinde = data[3]
    bfsnr = data[4]
    kanton = data[5]
    sprache = data[8]
    d[gemeinde] = { "Gemeinde": gemeinde,
        "Ort": ortschaft,
        "PLZ": zip,
        "BFS-Nr": bfsnr,
        "Kanton": kanton,
        "gesprochene Sprache": sprache}

file.close()

@app.get("/ort")
async def ort(ort: str):
    if ort in d:
        return d[ort]
    
    return {"ERROR": "ORT NOT FOUND"}

uvicorn.run(app, host="127.0.0.1", port=8000)

#aufrufen Link: http://127.0.0.1:8000/ort?ort=Surses
