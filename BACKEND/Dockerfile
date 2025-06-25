FROM postgres:16

# Instalar paquetes necesarios y limpiar
RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    locales \
    postgresql-contrib \
    postgresql-16-postgis-3 \
    && rm -rf /var/lib/apt/lists/*

# Generar la localización en_US.UTF-8
RUN locale-gen en_US.UTF-8

# Configuración de localización
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# Crear directorio para logs personalizados
RUN mkdir -p /var/log/postgresql && \
    chown postgres:postgres /var/log/postgresql

EXPOSE 5432
VOLUME ["/var/lib/postgresql/data"]
