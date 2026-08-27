FROM python:3.12-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        netcat-openbsd \
        ca-certificates \
        curl && \
    rm -rf /var/lib/apt/lists/*

# Install Amazon RDS CA bundle


WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .



EXPOSE 8000



CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application"]
