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

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application"]
