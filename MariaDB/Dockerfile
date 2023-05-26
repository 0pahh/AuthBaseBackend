FROM mariadb:10.3

ENV MYSQL_ROOT_PASSWORD=123456789siuuu
ENV MYSQL_DATABASE=database

COPY dump.sql /docker-entrypoint-initdb.d/

EXPOSE 3306