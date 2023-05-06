FROM alpine:3.17

ARG PB_VERSION=0.15.3
ARG PB_ENCRYPTION_KEY=XPUQSUllC6LvFOaGBCigYerIY9cy64Ih

RUN apk update \
    && apk add \
    unzip \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE 8080

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--encryptionEnv=PB_ENCRYPTION_KEY"]