IT 合伙人
=====

Technologies used in this project:

Database: Mongodb

ODM: Mongoose

Runtime: Nodejs

MVC framwork: Express

HTML template: Jade

UI framework: Bootstrap3, jQuery

Test framework: Mocha

=========================================
setup testing environment by docker in ubuntu 14.04

=======install docker===================
sudo apt-get update && apt-get upgrade -y
sudo reboot
apt-get install curl
curl -s https://get.docker.io/ubuntu/ | sudo sh

=========setup db （only once）===========
//get mongo image
docker pull mongo:latest

=========clone/update ithhr project=========
git clone https://git.oschina.net/tala/ithhr.git

==========create ithhr image=============
cd ithhr
docker build -t ithhr .
the Dockerfile will get node image for use, and expose 8005 port

=========start db container==============
docker run -d --name db mongo
//a clean db every time
docker run -d --name db -v /root/data:/data/db/ mongo
//data is persistent

=========start ithhr container=============
docker run -it -d -p 8005:8005 --name ithhr --link db:db ithhr

=========check status====================
docker images:
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
ithhr               latest              6db501be9e7a        4 minutes ago       755.3 MB
mongo               latest              be2c71632559        7 days ago          255.9 MB
node                0.10-onbuild        5187678bae07        2 weeks ago         697.4 MB

docker ps
CONTAINER ID        IMAGE               COMMAND                CREATED              STATUS              PORTS                    NAMES
6c1f5be91956        ithhr:latest        "npm start"            About a minute ago   Up About a minute   0.0.0.0:8005->8005/tcp   ithhr
557643369aed        mongo:latest        "/entrypoint.sh mong   3 minutes ago        Up 3 minutes        27017/tcp                db

==========refresh build and clear env:================
1. docker stop ithhr
2. docker rm ithhr
3. create a new image version
docker build -t ithhr:0.1 .
4. create a new ithhr:0.1 container
docker run -it -d -p 8005:8005 --name ithhr --link db:db ithhr:0.1
