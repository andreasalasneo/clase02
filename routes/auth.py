from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])

usuarios_db = []


@router.post("/register")
def registro(correo: str, contraseña: str):
    nuevo_usuario = {
        "correo": correo,
        "contraseña": contraseña
    }
    usuarios_db.append(nuevo_usuario)
    return {
        "mensaje": "¡Registro exitoso!",
        "usuario": {
            "correo": correo
        }
    }


@router.post("/login")
def login(correo: str, contraseña: str):
    usuario_encontrado = None
    for usuario in usuarios_db:
        if usuario["correo"] == correo and usuario["contraseña"] == contraseña:
            usuario_encontrado = usuario
            break
    
    if usuario_encontrado:
        return {
            "mensaje": "¡Login exitoso!",
            "datos": {
                "correo": correo
            }
        }
    else:
        return {
            "mensaje": "¡Credenciales inválidas!",
            "datos": {
                "correo": correo
            }
        }
