FROM python:3.12

# Install Poppler
RUN apt-get update && apt-get install -y poppler-utils

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

# WSGI 설정
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
# ASGI 설정
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "config.asgi:application"]
