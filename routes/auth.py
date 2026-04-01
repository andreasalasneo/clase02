from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="", tags=["auth"])

usuarios_db = []


class AuthPayload(BaseModel):
    correo: str
    contrasena: str


@router.post("/register")
def registro(payload: AuthPayload):
    nuevo_usuario = {
        "correo": payload.correo,
        "contrasena": payload.contrasena
    }
    usuarios_db.append(nuevo_usuario)
    return {
        "mensaje": "¡Registro exitoso!",
        "usuario": {
            "correo": payload.correo
        }
    }


@router.post("/login")
def login(payload: AuthPayload):
    usuario_encontrado = None
    for usuario in usuarios_db:
        if usuario["correo"] == payload.correo and usuario["contrasena"] == payload.contrasena:
            usuario_encontrado = usuario
            break

    if usuario_encontrado:
        return {
            "mensaje": "¡Login exitoso!",
            "datos": {
                "correo": payload.correo
            }
        }
    else:
        return {
            "mensaje": "¡Credenciales inválidas!",
            "datos": {
                "correo": payload.correo
            }
        }
