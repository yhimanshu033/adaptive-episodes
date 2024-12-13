FROM node:20.9.0 AS build-image
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY ./ ./

RUN echo "GOOGLE_CLIENT_ID=486778135608-vp84uv9oiduciqalnt6fdit32il4jsp4.apps.googleusercontent.com" > .env
RUN echo "GOOGLE_CLIENT_SECRET=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" >> .env
RUN echo "NEXTAUTH_URL=https://copilot.pocketfm.com" >> .env
RUN echo "NEXTAUTH_SECRET=TwmBgFrFU1DTsnrvm8pLBXt0yMPYFyT/EOCoX6AZo1s=" >> .env
RUN echo "NEXT_PUBLIC_BASE_URL=https://copilot.pocketfm.com" >> .env
RUN echo "NEXT_PUBLIC_LASERTOOLS_API_KEY=JHvCML1yir-6d6JcYVlsEeHd8QzAhZMy98Rc62plmHI" >> .env
RUN echo "NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBmIoLtILuplk6uqESjefva0Z_otnA7jEQ" >> .env
RUN echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ai-cowriter-german-team.firebaseapp.com" >> .env
RUN echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-cowriter-german-team" >> .env
RUN echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ai-cowriter-german-team.appspot.com" >> .env
RUN echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=486778135608" >> .env
RUN echo "NEXT_PUBLIC_FIREBASE_APP_ID=1:486778135608:web:673271b6c06a0cb10ff2cd" >> .env
RUN echo "NEXT_PUBLIC_BACKEND_URL=https://pocketfm-copilot-api.pocketfm.com" >> .env
RUN echo "NEXT_PUBLIC_SOCKET_BASE_URL=https://pocketfm-copilot-api.pocketfm.com" >> .env
RUN echo "NEXT_PUBLIC_BACKEND_API_KEY='2n{WHwe2[V,VG\K0A[!r.g1+[uar*d#w'" >> .env



ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

FROM node:20.9.0-alpine3.17
USER node
WORKDIR /usr/src/app
COPY --from=build-image --chown=node /usr/src/app/ ./
ENTRYPOINT npm start
