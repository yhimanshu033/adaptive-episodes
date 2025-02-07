# Stage 1: Build the Next.js application
FROM node:22.11.0 AS build-image
WORKDIR /usr/src/app
COPY ./ ./
RUN npm install

RUN echo "GOOGLE_CLIENT_ID=486778135608-vp84uv9oiduciqalnt6fdit32il4jsp4.apps.googleusercontent.com" > .env
RUN echo "GOOGLE_CLIENT_SECRET=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" >> .env
RUN echo "NEXTAUTH_URL=https://copilot.pocketfm.com" >> .env
RUN echo "NEXTAUTH_SECRET=TwmBgFrFU1DTsnrvm8pLBXt0yMPYFyT/EOCoX6AZo1s=" >> .env
RUN echo "NEXT_PUBLIC_BASE_URL=https://copilot.pocketfm.com" >> .env
RUN echo "NEXT_PUBLIC_LASERTOOLS_API_KEY=JHvCML1yir-6d6JcYVlsEeHd8QzAhZMy98Rc62plmHI" >> .env
RUN echo "NEXT_PUBLIC_BACKEND_URL=https://pocketfm-copilot-api.pocketfm.com" >> .env
RUN echo "NEXT_PUBLIC_BACKEND_API_KEY='2n{WHwe2[V,VG\K0A[!r.g1+[uar*d#w'" >> .env
RUN echo "NEXT_PUBLIC_SENTRY_DSN_URL=https://5c0b78d4ba827ea668db896758cc968a@o456578.ingest.us.sentry.io/4508737589018624" >> .env

ENV SENTRY_AUTH_TOKEN=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

RUN npm run build

# Stage 2: Final production environment
FROM node:22.11.0-alpine3.19 AS final
WORKDIR /usr/src/app

RUN apk add --no-cache nginx curl nginx-mod-http-headers-more
COPY --from=build-image /usr/src/app/ /usr/src/app/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["sh", "-c", "npm start & nginx -g 'daemon off;'"]
