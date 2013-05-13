#-*- coding: utf-8 -*-

import os

PRJ_PATH = os.path.abspath(os.path.curdir)

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('Quanquan Liu', 'quanquan@mit.edu'),
    #('David Karger', 'karger@mit.edu'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'picker+classcomment',                      
        'USER': 'picker',                      
        'PASSWORD': 'haystackpicker',  
        'HOST': 'sql.mit.edu',                      
        'PORT': '',                      
    }
}

TIME_ZONE = 'America/New_York'

LANGUAGE_CODE = 'en-us'

SITE_ID = 1

USE_I18N = True

MEDIA_ROOT = os.path.join(PRJ_PATH, "media")

MEDIA_URL = '/media/'

STATIC_ROOT = os.path.join(PRJ_PATH, "static")
STATIC_URL = '/classcomment/static/styles/'

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
        'PATH': os.path.join(os.path.dirname(__file__), 'whoosh_index'),
    },
}

# Additional locations of static files
STATICFILES_DIRS = (
    os.path.join(STATIC_ROOT, "styles/"),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

SECRET_KEY = ')2jk8m6%((v%dzy&amp;0t+72i#m_rbm83dvo5%fooei6g6%y7=z0w'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'urls'

TEMPLATE_DIRS = (
    os.path.join(os.path.dirname(__file__), "templates"),
)

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.comments',
    'django.contrib.staticfiles',
    
    'viewcomments',
    'django_comments_xtd',
    'django_markup',
    'south',
    'haystack',
)

EMAIL_HOST          = "smtp.gmail.com" 
EMAIL_PORT          = "587"
EMAIL_HOST_USER     = "mit.picker@gmail.com"
EMAIL_HOST_PASSWORD = "haystackpicker"
EMAIL_USE_TLS       = True 
DEFAULT_FROM_EMAIL  = "MIT Course Picker <course-picker@lists.csail.mit.edu>"
SERVER_EMAIL        = DEFAULT_FROM_EMAIL
EMAIL_SUBJECT_PREFIX = "[Picker] "

# Fill in actual EMAIL settings above, and comment out the 
# following line to let Course Picker send out confirmation emails
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

COMMENTS_APP = "django_comments_xtd"
COMMENTS_XTD_CONFIRM_EMAIL = True
COMMENTS_XTD_SALT = "es-war-einmal-una-bella-princesa-in-a-beautiful-castle"
COMMENTS_XTD_MAX_THREAD_LEVEL = 10
