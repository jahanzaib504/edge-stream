#!/bin/sh

echo "Container starting..."

# Wait for database
until nc -z postgres 5432; do
    echo "Waiting for PostgreSQL..."
    sleep 1
done

echo "Database is ready."

# Run migrations
python manage.py migrate

# Create superuser if it doesn't exist
python manage.py shell <<'PY'
import os
from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ["DJANGO_SUPERUSER_USERNAME"]
email = os.environ["DJANGO_SUPERUSER_EMAIL"]
password = os.environ["DJANGO_SUPERUSER_PASSWORD"]

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        is_verified=True
    )
    print(f"Superuser '{username}' created.")
else:
    print(f"Superuser '{username}' already exists.")
PY

# Collect static files
python manage.py collectstatic --noinput

echo "Starting server..."

# Replace shell with the main process
exec "$@"