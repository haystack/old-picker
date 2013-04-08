from datetime import datetime

from django.db import models
from django.db.models import permalink, Q
from django.utils.translation import ugettext_lazy as _


class PublicManager(models.Manager):
    """Returns published articles that are not in the future."""
    
    def name(self):
        return self.get_query_set().filter(publish__lte=datetime.now())

class MITClass(models.Model):
    """Class that accepts comments"""
    number_name = models.TextField('number_name')
    title = models.CharField('title', max_length=300)
    slug = models.SlugField('slug', max_length=255, unique=True)
    description = models.TextField('description')
    instructors = models.TextField('instructors')
    prereqs = models.TextField('prereqs')
    classtype = models.CharField('classtype', max_length = 50)
    units = models.TextField('units')
    semester = models.CharField('semester', max_length=50)

    objects = PublicManager()

    class Meta:
        db_table = 'mitclass'
        ordering = ('-number_name',)
        verbose_name = _('class')
        verbose_name_plural = _('classes')

    def __unicode__(self):
        return u'%s' % self.title

    @models.permalink
    def get_absolute_url(self):
        return ('mit-class-detail', (), {'slug': self.slug})

class History(models.Model):
    queries = models.TextField('queries')
    comments_page = models.CharField('comments_page', max_length=300)
    publish = models.DateTimeField('publish', default=datetime.now)

    objects = PublicManager()

    class Meta:
        db_table = 'lastvisited'
        ordering = ('-publish',)
    
