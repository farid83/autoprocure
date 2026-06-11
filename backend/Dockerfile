FROM php:8.5-fpm-alpine 
# ↑ Image officielle PHP 8.4 avec PHP-FPM (gestionnaire de processus PHP) 

# Installer les outils système et les extensions PHP nécessaires à Symfony 
RUN apk add --no-cache \
    git \
    unzip \
    libpq-dev \
    libxslt-dev \
    icu-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        xsl \
        intl
# ↑ 'xsl' : extension manquante requise par lorenzo/pinky  (correction apporté)
# ↑ 'intl' : extension courante pour Symfony (internationalisation)

# Copier Composer depuis son image officielle 
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer 

WORKDIR /var/www/html 

# Optimisation : copier composer.json/lock d'abord (cache Docker)
COPY composer.json composer.lock ./

# Ensuite copier le reste
COPY . . 

# Créer un fichier .env avec les variables d'environnement nécessaires (ex: APP_ENV=prod)
RUN echo "APP_ENV=prod" > .env

# Composer install
RUN APP_ENV=prod composer install --optimize-autoloader --no-scripts --no-dev

EXPOSE 9000 
CMD ["php", "-S", "0.0.0.0:9000", "-t", "public"]
# ↑ Correction : 'public' au lieu de 'skeleton/public' (chemin standard Symfony)