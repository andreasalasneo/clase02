# Usar la imagen base nginx:alpine
FROM nginx:alpine

# Eliminar la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos al directorio de Nginx
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Exponer el puerto 8080 (requerido por Cloud Run)
EXPOSE 8080

# Arrancar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
