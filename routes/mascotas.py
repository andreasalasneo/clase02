from fastapi import APIRouter
from routes.servicios import servicios_db

router = APIRouter(prefix="/mascotas", tags=["mascotas"])

mascotas_db = []


@router.post("/registrar")
def registrar_mascota(correo_dueno: str, nombre_mascota: str, tipo_servicio: str, fecha: str):
    nueva_mascota = {
        "correo_dueno": correo_dueno,
        "nombre_mascota": nombre_mascota,
        "tipo_servicio": tipo_servicio,
        "fecha": fecha
    }
    mascotas_db.append(nueva_mascota)
    return {
        "mensaje": "¡Mascota registrada exitosamente!",
        "mascota": nueva_mascota
    }


@router.get("/{correo}")
def obtener_mascotas_por_correo(correo: str):
    # Filtrar mascotas por correo del dueño
    mascotas_usuario = [mascota for mascota in mascotas_db if mascota["correo_dueno"] == correo]
    
    # Obtener servicios únicos solicitados por las mascotas del usuario
    servicios_solicitados = []
    tipos_servicios = set(mascota["tipo_servicio"] for mascota in mascotas_usuario)
    
    for servicio in servicios_db:
        if servicio["nombre"] in tipos_servicios:
            servicios_solicitados.append(servicio)
    
    return {
        "correo_dueno": correo,
        "mascotas": mascotas_usuario,
        "servicios_solicitados": servicios_solicitados
    }


@router.get("/reporte/{correo}")
def obtener_reporte_por_correo(correo: str):
    # Filtrar mascotas por correo del dueño
    mascotas_usuario = [mascota for mascota in mascotas_db if mascota["correo_dueno"] == correo]
    
    # Obtener servicios únicos solicitados por las mascotas del usuario
    servicios_solicitados = []
    tipos_servicios = set(mascota["tipo_servicio"] for mascota in mascotas_usuario)
    
    for servicio in servicios_db:
        if servicio["nombre"] in tipos_servicios:
            servicios_solicitados.append(servicio)
    
    # Calcular total gastado
    total_gastado = sum(servicio["precio"] for servicio in servicios_solicitados)
    
    return {
        "correo_dueno": correo,
        "total_servicios": len(mascotas_usuario),
        "servicios_registrados": servicios_solicitados,
        "total_gastado": total_gastado
    }