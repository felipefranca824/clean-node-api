FROM node:18
WORKDIR /usr/src/api-clean-node
COPY ./package.json .
RUN npm install --omit=dev
EXPOSE 5000