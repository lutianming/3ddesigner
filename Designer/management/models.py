from django.db import models
from django.contrib import admin

class modelFile(models.Model):
    title = models.CharField(max_length=30)
    file = models.FileField(upload_to='files')
    date_time = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    
    class Meta:
        ordering = ['-date_time']
    
    def __unicode__(self):
        return u'%s' % (self.title)
        
admin.site.register(modelFile)
    
    
    
    

