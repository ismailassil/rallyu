FROM curlimages/curl:8.13.0

COPY ./script/entrypoint.sh /script.sh

RUN chmod +x /script.sh

ENTRYPOINT [ "/script.sh" ]