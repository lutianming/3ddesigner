from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User  

class Msg(models.Model):
    title = models.CharField(max_length=30)
    content = models.TextField()
    user = models.ForeignKey(User)
    ip = models.IPAddressField()
    datetime = models.DateTimeField(auto_now_add=True)
    clickcount = models.IntegerField(default=0)
    
    def __str__(self):
        return 'User %s comments on: %s' % (self.user.username, self.title)
    
    class Meta:
        ordering = ['-datetime']

admin.site.register(Msg)
    
