#!/bin/sh

echo "Container starting..."

# Wait for database 
until nc -z postgres 5432; do
    echo "Waiting for PostgreSQL..."
    sleep 1
done

echo "Database is ready."

python manage.py makemigrations
# Run migrations
python manage.py migrate


echo "Starting server..."

# Replace shell with the main process
exec "$@"