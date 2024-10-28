FROM nginx:alpine
LABEL authors="LEE JIHYE"

# COPY ./image /usr/share/nginx/html/images
COPY nginx.conf.template /etc/nginx/nginx.conf.template

EXPOSE 80
# 치환할 환경 변수들 입력
CMD ["/bin/sh", "-c", "envsubst '$DOCKER_TAG_SPRING $BACKEND_PORT $SERVER_NAME $CONTEXT_PATH' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
