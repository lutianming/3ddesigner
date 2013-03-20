from django.db import models
from django.contrib import admin

# Create your models here.
class User(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    email = models.EmailField(blank=True, verbose_name='e-mail')
    
    def __unicode__(self):
        return u'%s %s' % (self.first_name, self.last_name)
    
    class Meta:
        ordering = ['first_name']

admin.site.register(User)
