FROM mcr.microsoft.com/playwright:v1.62.1-noble
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --omit=dev --no-audit --no-fund
COPY src ./src
COPY release.json ./release.json
COPY pacote ./pacote
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080 PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
USER pwuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/readyz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "src/server.cjs"]
