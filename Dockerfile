# ==========================================
# Stage 1: Build the frontend and compiled content
# ==========================================
FROM node:24-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# 1. Copy workspace configurations to root
COPY reference/package.json reference/pnpm-lock.yaml reference/pnpm-workspace.yaml ./reference/
COPY monorepo/package.json ./monorepo/
COPY markdown-parser/package.json ./markdown-parser/

# 2. Copy individual package.json files for aggressive dependency caching.
# This prevents cache invalidation and guarantees all dependencies (like esbuild) are fully installed

# Fuyeor Reference Repositories
COPY reference/apps/front-end/package.json ./reference/apps/front-end/
COPY reference/packages/generator/package.json ./reference/packages/generator/

# Shared Monorepo Repositories
COPY monorepo/packages/commons/package.json ./monorepo/packages/commons/
COPY monorepo/packages/interactify/package.json ./monorepo/packages/interactify/
COPY monorepo/packages/vue-query/package.json ./monorepo/packages/vue-query/
COPY monorepo/packages/vue-router/package.json ./monorepo/packages/vue-router/
COPY monorepo/packages/locale/package.json ./monorepo/packages/locale/
COPY monorepo/packages/config/package.json ./monorepo/packages/config/

# Markdown Parser Repositories
COPY markdown-parser/packages/markdown-parser/package.json ./markdown-parser/packages/markdown-parser/
COPY markdown-parser/packages/markdown-parser-vue/package.json ./markdown-parser/packages/markdown-parser-vue/

# 3. Cache and install dependencies across the workspace using pnpm store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    cd reference && pnpm install --frozen-lockfile

# 4. Copy the complete source code of all three repositories
COPY reference/ ./reference/
COPY monorepo/ ./monorepo/
COPY markdown-parser/ ./markdown-parser/

# 5. Copy the pre-extracted locale-cli binary from our build context
COPY reference/bin/locale-cli /usr/local/bin/locale-cli
RUN chmod +x /usr/local/bin/locale-cli

# 6. Workaround path compatibility for locale-cli, then generate localized bundles
RUN cd reference/apps && \
    mkdir -p reference && \
    cd reference && \
    ln -s ../front-end front-end && \
    cd ../../ && \
    locale-cli make reference --prod && \
    locale-cli make reference manifest

# 7. Build the generator CLI and compile Markdown/FON contents into static JSON artifacts
RUN cd reference && \
    pnpm --filter @fuyeor/reference-generator build && \
    pnpm --filter @fuyeor/reference-generator start

# 8. Build the highly optimized reference-front-end Vue 3.5 CSR application
RUN cd reference && pnpm --filter @fuyeor/reference-front-end build

# ==========================================
# Stage 2: Deploy and serve via Nginx
# ==========================================
FROM nginx:alpine AS runner

# Remove default static pages to keep the container clean
RUN rm -rf /usr/share/nginx/html/*

# 1. Copy the compiled Vue 3.5 SPA assets to the web root
COPY --from=builder /app/reference/apps/front-end/dist /usr/share/nginx/html

# 2. Copy the compiled content directly to /v1/content on disk.
COPY --from=builder /app/reference/content /usr/share/nginx/html/v1/content

# 3. Inject custom Nginx config, ensuring SPA client routing compatibility and mapping .fon as application/json
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Support SPA router history mode \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]