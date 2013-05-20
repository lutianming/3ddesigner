from django.db import models
from django.contrib import admin

class modelFile(models.Model):
    title = models.CharField(max_length=30)
    file = models.FileField(upload_to='models')
    date_time = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    
    class Meta:
        ordering = ['-date_time']
    
    def __unicode__(self):
        return u'%s' % (self.title)
        
class ModelType(models.Model):
    name = models.CharField(max_length=30)
    
    class Meta:
        ordering = ['name']
        
    def __unicode__(self):
        return u'%s' % (self.name)
    
class ModelData(models.Model):
    name = models.CharField(max_length=30)
    type = models.ForeignKey(ModelType)
    model_url = models.FileField(upload_to='models')
    image_url = models.ImageField(upload_to='images')
    icon_url = models.ImageField(upload_to='icons')
    scale_x = models.FloatField()
    scale_y = models.FloatField()
    scale_z = models.FloatField()
    rotation_x = models.FloatField()
    rotation_y = models.FloatField()
    rotation_z = models.FloatField()
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    baseY = models.FloatField()
    height = models.FloatField()

    class Meta:
        ordering = ['name']
        
    def __unicode__(self):
        return u'%s' % (self.name)
    
admin.site.register(modelFile)
admin.site.register(ModelType)
admin.site.register(ModelData)
    
    
    
    

