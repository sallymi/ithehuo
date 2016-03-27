FROM node:0.12-onbuild
RUN apt-get update
RUN apt-get install imagemagick
RUN apt-get -y --force-yes install graphicsmagick
EXPOSE 3000
