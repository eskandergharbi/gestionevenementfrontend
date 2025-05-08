FROM oraclelinux:7-slim

MAINTAINER Eskander Gharbi

# Installer les paquets nécessaires
RUN yum -y install oracle-rdbms-server-11gR2-preinstall && \
    yum clean all

# Ajouter les fichiers d'installation
ADD database /tmp/database

# Installer Oracle
RUN /tmp/database/runInstaller -silent -responseFile /tmp/database/response/db_install.rsp -ignorePrereq

# Configurer les variables d'environnement
ENV ORACLE_HOME=/u01/app/oracle/product/11.2.0/dbhome_1 \
    ORACLE_SID=ORCL \
    PATH=$PATH:/u01/app/oracle/product/11.2.0/dbhome_1/bin

EXPOSE 1521 8080

CMD ["/bin/bash"]
