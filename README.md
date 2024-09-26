# Build Image

## Build PHP Ubuntu Image

`docker buildx build -t ngingxmahatour:latest .`

# Create Container

## Windows 
### PowerShell
docker run --name mahatour -it -p 80:80 ngingxmahatour
docker build -t basic-node-app .
docker run --name basicnode -p 3000:3000 -v ${PWD}:/usr/src/app basic-node-app
docker exec -it basicnode npm install
docker exec -it basicnode npm install --save-dev nodemon

`docker run --name mahatour -it -v ${PWD}:/var/www/html/mahatour -p 80:80 ngingxmahatour`

### CommandPrompt
`docker run --name mahatour -it -v %cd%:/var/www/html/mahatour -p 80:80 ngingxmahatour`

## Ubuntu
`docker run --name mahatour -it -v "$(pwd)":/var/www/html/mahatour -p 80:80 ngingxmahatour`

# Execute firstInstall.sh only once
`./firstInstall.sh`

# Start nginx

/usr/sbin/nginx

# Check nginx status

nginx -t

# Stop nginx

/usr/sbin/nginx -s stop

# Reload nginx

/usr/sbin/nginx -s reload


# View nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Configure nginx

nano /etc/nginx/nginx.conf


After cloning your Laravel project, follow these steps to set it up:

    Install Composer Dependencies:
    Navigate to your project directory and run:

composer install


cp .env.example .env

php artisan key:generate


php artisan migrate


php artisan db:seed

