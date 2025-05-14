FROM docker.elastic.co/elasticsearch/elasticsearch:8.13.2

USER root

COPY ./script.sh /script.sh

RUN chmod +x /script.sh

ENTRYPOINT [ "./script.sh" ]
