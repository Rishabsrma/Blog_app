from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    bio = models.TextField(blank=True, default="")
    avatar = models.CharField(max_length=100, default="👤")

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

class Post(models.Model):
    MOOD_CHOICES = [
        ('💻', 'Tech'),
        ('🎨', 'Creative'),
        ('🤔', 'Thought')
    ]
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    mood = models.CharField(max_length=2, choices=MOOD_CHOICES, default='💻')