from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('posts/', views.post_list),
    path('posts/<int:post_id>/', views.post_detail),
]