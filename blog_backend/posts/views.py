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
    if request.method == 'POST':
        try:
            # 1. Parse JSON
            data = json.loads(request.body)
            
            # 2. Validate Token
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            if not token:
                return JsonResponse({'error': 'Authentication required'}, status=401)
                
            # 3. Validate Data
            if not data.get('title'):
                return JsonResponse({'error': 'Title is required'}, status=400)
                
            if len(data['title']) > 200:
                return JsonResponse({'error': 'Title cannot exceed 200 characters'}, status=400)
                
            if not data.get('content'):
                return JsonResponse({'error': 'Content is required'}, status=400)
                
            # Create Post (if all validations pass)
            post = Post.objects.create(
                title=data['title'],
                content=data['content'],
                author=request.user  
            )
            
            return JsonResponse({
                'id': post.id,
                'title': post.title,
                'created_at': post.created_at
            }, status=201)
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)