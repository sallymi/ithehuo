FROM node:0.12-onbuild
RUN apt-get update
RUN apt-get install imagemagick
EXPOSE 8005
