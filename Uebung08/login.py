import uvicorn
import sqlalchemy
from fastapi import FastAPI, Depends, status, Request, Form
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException 
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="templates/")

manager = LoginManager("1234", token_url="/auth/login", use_cookie=True)
manager.cookie_name = "ch.fhnw.testapp"

notes = sqlalchemy.Table(
    "notes", templates,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key = True ),
    sqlalchemy.Column ("text", sqlalchemy.String)
)

DB = {"user1": {"name":"Max Meier",
                "email": "blablabla@gmail.com",
                "passwort": "12345"},
      "user2 ":  {"name":"Hans Muster",
                "email": "muster@gmail.com",
                "passwort": "54321"}
    }

@manager.user_loader()
def load_user(username: str):
    user = DB.get(username)                          
    return user


@app.post("/auth/login")
def login(data: OAuth2PasswordRequestForm = Depends()):
    username = data.username
    password = data.password
    user = load_user(username)

    if not user:
        raise InvalidCredentialsException
    if user['passwort'] != password:
        raise InvalidCredentialsException

    access_token = manager.create_access_token(
        data={"sub":username}
    )

    resp = RedirectResponse(url="/new",status_code=status.HTTP_302_FOUND)
    manager.set_cookie(resp, access_token)

    return resp

@app.get("/login")
def login():
    file = open("templates/login.html", encoding="utf-8")
    data = file.read()
    file.close()
    return HTMLResponse(content=data)

@app.get("/new", response_class=HTMLResponse)
def getSecretPage(user=Depends(manager)):
    return "Hello " + str(user["name"])

@app.get("/new")
async def create_notes(request: Request):
    return templates.TemplateResponse('login.html', context={'request': request})

@app.post("/new")
def post_note(titel=Form(), text=Form()):
    query = notes.insert().values(title=titel, text=text)
    return templates.TemplateResponse('login.html',
        context={'titel': titel, 'text': text})

uvicorn.run(app, host="127.0.0.1", port=8000)








