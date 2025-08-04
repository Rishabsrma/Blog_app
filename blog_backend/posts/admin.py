from django.contrib import admin
from .models import User, Post

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'bio')

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'mood', 'created_at')
    list_filter = ('mood', 'created_at')