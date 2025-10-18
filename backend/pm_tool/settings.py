"""
Django settings for pm_tool project, configured for PythonAnywhere deployment.
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- Production Configuration ---
# In production, DEBUG should be False and you should get your SECRET_KEY from a secure place.
# For PythonAnywhere, you can set this as an environment variable in your WSGI file.
SECRET_KEY = os.environ.get('SECRET_KEY', 'a-default-secret-key-for-local-use')
DEBUG = False # Set to False for production

# Add your PythonAnywhere domain name here.
ALLOWED_HOSTS = [
    'your-username.pythonanywhere.com',
]

# --- Application Definition ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pm_tool.urls'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
WSGI_APPLICATION = 'pm_tool.wsgi.application'

# --- Database Configuration for PythonAnywhere ---
# Replace the placeholder values with the credentials from your PythonAnywhere "Databases" tab.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your-username$pm_tool_db',
        'USER': 'your-username',
        'PASSWORD': 'your-mysql-password',
        'HOST': 'your-username.mysql.pythonanywhere-services.com',
    }
}

# --- Password Validation ---
AUTH_PASSWORD_VALIDATORS = [{'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},{'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},{'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},{'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'}]

# --- Internationalization & Static Files ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
# This is the directory on the PythonAnywhere server where your static files will be collected.
STATIC_ROOT = '/home/your-username/project-management-tool/backend/staticfiles'

# --- Custom App Settings ---
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'api.User'

# Add your live Vercel frontend URL here.
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    # "https://your-frontend-app.vercel.app",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}