FROM docker.elastic.co/elasticsearch/elasticsearch:8.13.2

USER root

COPY ./script.sh /script.sh

ENTRYPOINT [ "sh", "/script.sh" ]
