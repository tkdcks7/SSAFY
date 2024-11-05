FROM python:3.12

# Install Poppler
RUN apt-get update && apt-get install -y poppler-utils

WORKDIR /app

ENV DJANGO_SETTINGS_MODULE=config.settings.prod

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
