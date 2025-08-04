from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from .models import Post, User  
from blog_backend.auth import create_jwt, decode_jwt
import json

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = User.objects.create_user(
                username=data['email'],  # Using email as username
                email=data['email'],
                password=data['password']
            )
            token = create_jwt(user)
            return JsonResponse({
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email
                }
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = authenticate(
                username=data['email'],
                password=data['password']
            )
            
            if user is not None:
                token = create_jwt(user)
                return JsonResponse({
                    'token': token,
                    'user': {
                        'id': user.id,
                        'email': user.email
                    }
                })
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def post_list(request):
    if request.method == 'GET':
        posts = list(Post.objects.values('id', 'title', 'content', 'mood', 'author_id'))
        return JsonResponse(posts, safe=False)
    
    elif request.method == 'POST':
        token = request.headers.get('Authorization', '').split('Bearer ')[-1]
        payload = decode_jwt(token)
        if not payload:
            return JsonResponse({'error': 'Invalid token'}, status=401)
            
        try:
            data = json.loads(request.body)
            post = Post.objects.create(
                title=data['title'],
                content=data['content'],
                mood=data['mood'],
                author_id=payload['user_id']
            )
            return JsonResponse({
                'id': post.id,
                'title': post.title,
                'mood': post.mood,
                'created_at': post.created_at
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)