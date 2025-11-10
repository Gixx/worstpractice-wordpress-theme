FROM wordpress:latest

RUN apt-get update && apt-get install -y \
    libyaml-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pecl install yaml \
    && echo "extension=yaml.so" > /usr/local/etc/php/conf.d/yaml.ini
