// Variables globales
let usuarioLogueado = null;
let servicios = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarServicios();
    switchTab('inicio');
    aplicarEstadoInicial();

    // Event listeners para navegación
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.target.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    // Event listeners para formularios
    const saludoForm = document.querySelector('.saludo-form');
    const registroForm = document.querySelector('.registro-form');
    const loginForm = document.querySelector('.login-form');
    const servicioForm = document.querySelector('.agregar-servicio-form');
    const mascotaForm = document.querySelector('.registrar-mascota-form');

    if (saludoForm) saludoForm.addEventListener('submit', manejarSaludo);
    if (registroForm) registroForm.addEventListener('submit', manejarRegistro);
    if (loginForm) loginForm.addEventListener('submit', manejarLogin);
    if (servicioForm) servicioForm.addEventListener('submit', manejarAgregarServicio);
    if (mascotaForm) mascotaForm.addEventListener('submit', manejarRegistrarMascota);

    // Buscadores (botones)
    const buscarMascotaBtn = document.getElementById('btn-buscar-mascota');
    const buscarReporteBtn = document.getElementById('btn-buscar-reporte');
    if (buscarMascotaBtn) buscarMascotaBtn.addEventListener('click', manejarBuscarMascota);
    if (buscarReporteBtn) buscarReporteBtn.addEventListener('click', manejarBuscarReporte);

    // Event listener para logout
    const btnSalir = document.getElementById('btn-salir');
    if (btnSalir) btnSalir.addEventListener('click', logout);
});

// Función para cambiar tab
function switchTab(name) {
    const tabsProtegidos = ['servicios', 'mascotas', 'reporte'];
    if (tabsProtegidos.includes(name) && !usuarioLogueado) {
        mostrarAlerta('Debes iniciar sesión para acceder a esta sección.', 'error', 'acceso');
        return;
    }

    // Quitar active de todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Agregar active al seleccionado
    const targetSection = document.getElementById(name);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Actualizar nav
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === name) {
            link.classList.add('active');
        }
    });

    // Si es reporte y usuario logueado, pre-llenar correo
    if (name === 'reporte' && usuarioLogueado) {
        const inputReporte = document.getElementById('buscar-correo');
        if (inputReporte) inputReporte.value = usuarioLogueado;
    }
}

function aplicarEstadoInicial() {
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        const tab = link.getAttribute('data-tab');
        if (['servicios', 'mascotas', 'reporte'].includes(tab)) {
            link.classList.add('locked');
        } else {
            link.classList.remove('locked');
        }
        link.classList.remove('active');
    });
    document.querySelector('.user-badge span').textContent = 'Usuario: Admin';
    const btnSalir = document.getElementById('btn-salir');
    if (btnSalir) btnSalir.style.display = 'none';
}

// Función para cargar servicios
async function cargarServicios() {
    try {
        const response = await fetch('http://127.0.0.1:8000/servicios');
        const data = await response.json();
        servicios = data.servicios;
        renderServicios();
        actualizarSelectServicios();
    } catch (error) {
        console.error('Error cargando servicios:', error);
    }
}

// Render servicios en lista
function renderServicios() {
    const lista = document.getElementById('servicios-lista');
    lista.innerHTML = '';
    servicios.forEach(servicio => {
        const li = document.createElement('li');
        li.textContent = `${servicio.nombre} - $${servicio.precio}`;
        lista.appendChild(li);
    });
}

// Actualizar select de servicios
function actualizarSelectServicios() {
    const select = document.getElementById('servicio-mascota');
    select.innerHTML = '<option value="">Selecciona un servicio</option>';
    servicios.forEach(servicio => {
        const option = document.createElement('option');
        option.value = servicio.nombre;
        option.textContent = servicio.nombre;
        select.appendChild(option);
    });
}

// Manejar saludo
async function manejarSaludo(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre-saludo').value;
    try {
        const response = await fetch(`http://127.0.0.1:8000/bienvenido/${nombre}`);
        const data = await response.json();
        mostrarAlerta(data.mensaje, 'success', 'inicio');
    } catch (error) {
        mostrarAlerta('Error al saludar.', 'error', 'inicio');
    }
}

// Manejar registro
async function manejarRegistro(e) {
    e.preventDefault();
    const correo = document.getElementById('email-registro').value;
    const contrasena = document.getElementById('password-registro').value;
    try {
        const response = await fetch('http://127.0.0.1:8000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });
        const data = await response.json();
        if (response.ok) {
            mostrarAlerta('Registro exitoso.', 'success', 'acceso');
        } else {
            mostrarAlerta(data.detail || 'Error en registro.', 'error', 'acceso');
        }
    } catch (error) {
        mostrarAlerta('Error en registro.', 'error', 'acceso');
    }
}

// Manejar login
async function manejarLogin(e) {
    e.preventDefault();
    const correo = document.getElementById('email-login').value;
    const contrasena = document.getElementById('password-login').value;
    try {
        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });
        const data = await response.json();
        if (response.ok) {
            usuarioLogueado = correo;
            mostrarAlerta('Login exitoso.', 'success', 'acceso');
            desbloquearTabs();
            switchTab('servicios');
        } else {
            mostrarAlerta(data.detail || 'Error en login.', 'error', 'acceso');
        }
    } catch (error) {
        mostrarAlerta('Error en login.', 'error', 'acceso');
    }
}

// Desbloquear tabs
function desbloquearTabs() {
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('locked');
    });
    document.querySelector('.user-badge span').textContent = `Usuario: ${usuarioLogueado}`;
    document.getElementById('btn-salir').style.display = 'block';
}

// Logout
function logout() {
    usuarioLogueado = null;
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (['servicios', 'mascotas', 'reporte'].includes(link.getAttribute('data-tab'))) {
            link.classList.add('locked');
        }
        link.classList.remove('active');
    });
    document.querySelector('.user-badge span').textContent = 'Usuario: Admin';
    document.getElementById('btn-salir').style.display = 'none';
    switchTab('acceso');
}

// Manejar agregar servicio
async function manejarAgregarServicio(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre-servicio').value;
    const precio = parseFloat(document.getElementById('precio-servicio').value);
    try {
        const response = await fetch('http://127.0.0.1:8000/servicios/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, precio })
        });
        if (response.ok) {
            mostrarAlerta('Servicio agregado.', 'success', 'servicios');
            cargarServicios();
        } else {
            mostrarAlerta('Error agregando servicio.', 'error', 'servicios');
        }
    } catch (error) {
        mostrarAlerta('Error agregando servicio.', 'error', 'servicios');
    }
}

// Manejar registrar mascota
async function manejarRegistrarMascota(e) {
    e.preventDefault();
    const correo = document.getElementById('correo-mascota').value;
    const nombre = document.getElementById('nombre-mascota').value;
    const tipo_servicio = document.getElementById('servicio-mascota').value;
    const fecha = document.getElementById('fecha-mascota').value;
    try {
        const response = await fetch('http://127.0.0.1:8000/mascotas/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo_dueno: correo, nombre_mascota: nombre, tipo_servicio, fecha })
        });
        if (response.ok) {
            mostrarAlerta('Mascota registrada.', 'success', 'mascotas');
        } else {
            mostrarAlerta('Error registrando mascota.', 'error', 'mascotas');
        }
    } catch (error) {
        mostrarAlerta('Error registrando mascota.', 'error', 'mascotas');
    }
}

// Manejar buscar mascota
async function manejarBuscarMascota(e) {
    e.preventDefault();
    const correo = document.getElementById('buscar-mascota').value;
    try {
        const response = await fetch(`http://127.0.0.1:8000/mascotas/${correo}`);
        const data = await response.json();
        renderMascotas(data.mascotas);
    } catch (error) {
        mostrarAlerta('Error buscando mascotas.', 'error', 'mascotas');
    }
}

// Render mascotas
function renderMascotas(mascotas) {
    const container = document.querySelector('.mascotas-container') || document.createElement('div');
    container.className = 'mascotas-container';
    container.innerHTML = '';
    mascotas.forEach(mascota => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h4>${mascota.nombre}</h4>
            <p>Servicio: ${mascota.tipo_servicio}</p>
            <p>Fecha: ${mascota.fecha}</p>
        `;
        container.appendChild(card);
    });
    document.getElementById('mascotas').appendChild(container);
}

// Manejar buscar reporte
async function manejarBuscarReporte(e) {
    e.preventDefault();
    const correo = document.getElementById('buscar-correo').value;
    try {
        const response = await fetch(`http://127.0.0.1:8000/mascotas/reporte/${correo}`);
        const data = await response.json();
        renderReporte(data);
    } catch (error) {
        mostrarAlerta('Error obteniendo reporte.', 'error', 'reporte');
    }
}

// Render reporte
function renderReporte(data) {
    const container = document.getElementById('area-resultados');
    container.innerHTML = `
        <div class="stat-box">
            <h4>Cantidad de Servicios</h4>
            <p>${data.cantidad_servicios}</p>
        </div>
        <div class="stat-box">
            <h4>Total Gastado</h4>
            <p>$${data.total_gastado}</p>
        </div>
        <div class="stat-box">
            <h4>Correo</h4>
            <p>${data.correo}</p>
        </div>
        <div class="servicios-tags">
            ${data.servicios.map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
    `;
}

// Mostrar alerta
function mostrarAlerta(mensaje, tipo, seccion) {
    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.textContent = mensaje;
    document.getElementById(seccion).appendChild(alerta);
    setTimeout(() => alerta.remove(), 3000);
}