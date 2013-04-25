from django.db import models
from django.contrib.auth.models import User  

class SceneData(models.Model):
    title = models.CharField(max_length=30)
    time = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=300)
    content = models.TextField()
    author = models.ForeignKey(User)
    img_url = models.CharField(max_length=100)
    view_count = models.IntegerField()

class SceneDraft(models.Model):
    title = models.CharField(max_length=30)
    time = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=300)
    content = models.TextField()
    author = models.ForeignKey(User)
    scene = models.ForeignKey(SceneData)

