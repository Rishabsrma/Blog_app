from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Post
from blog_backend.auth import create_jwt, decode_jwt
import json

@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.create_user(
            username=data['email'],  # Using email as username
            email=data['email'],
            password=data['password']
        )
        token = create_jwt(user)
        return JsonResponse({'token': token}, status=201)

@csrf_exempt
def post_list(request):
    if request.method == 'GET':
        posts = list(Post.objects.values('id', 'title', 'content', 'mood'))
        return JsonResponse(posts, safe=False)
    
    elif request.method == 'POST':
        token = request.headers.get('Authorization', '').split('Bearer ')[-1]
        payload = decode_jwt(token)
        if not payload:
            return JsonResponse({'error': 'Invalid token'}, status=401)
            
        data = json.loads(request.body)
        post = Post.objects.create(
            title=data['title'],
            content=data['content'],
            mood=data['mood'],
            author_id=payload['user_id']
        )
        return JsonResponse({'id': post.id}, status=201)
