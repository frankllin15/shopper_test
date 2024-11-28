# Dockerfile do frontend (React)
FROM node:20.7


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Adicionar o argumento para aceitar a variável
ARG VITE_GOOGLE_API_KEY

# Passar a variável como uma env no build
ENV VITE_GOOGLE_API_KEY=${VITE_GOOGLE_API_KEY}

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "preview"]
