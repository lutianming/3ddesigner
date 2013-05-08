from django.db import models
from django.contrib.auth.models import User  

class SceneData(models.Model):
    title = models.CharField(max_length=30)
    time = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=300)
    content3 = models.TextField()
    content2 = models.TextField()
    author = models.ForeignKey(User)
    img_url = models.CharField(max_length=100)
    view_count = models.IntegerField()
    
    class Meta:
        ordering = ['-time']

class SceneDraft(models.Model):
    title = models.CharField(max_length=30)
    time = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=300)
    content3 = models.TextField()
    content2 = models.TextField()
    author = models.ForeignKey(User)
    scene = models.ForeignKey(SceneData)
    
    class Meta:
        ordering = ['-time']

