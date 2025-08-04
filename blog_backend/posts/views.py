from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from .models import Post, User
from blog_backend.auth import create_jwt, get_user_from_token
import json
from datetime import datetime

# Helper function to format post data
def format_post(post):
    return {
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'author': {
            'id': post.author.id,
            'email': post.author.email,
            'avatar': post.author.avatar
        },
        'mood': post.mood,
        'created_at': post.created_at,
        'updated_at': post.updated_at if hasattr(post, 'updated_at') else None
    }

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)
                
            user = User.objects.create_user(
                username=data['email'],
                email=data['email'],
                password=data['password'],
                bio=data.get('bio', ''),
                avatar=data.get('avatar', '👤')
            )
            token = create_jwt(user)
            return JsonResponse({
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'bio': user.bio,
                    'avatar': user.avatar
                }
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = authenticate(
                username=data['email'],
                password=data['password']
            )
            
            if user:
                token = create_jwt(user)
                return JsonResponse({
                    'token': token,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'bio': user.bio,
                        'avatar': user.avatar
                    }
                })
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def post_list(request):
    if request.method == 'GET':
        # Get all posts with optional filters
        mood_filter = request.GET.get('mood', None)
        author_filter = request.GET.get('author_id', None)
        
        posts = Post.objects.all().order_by('-created_at')
        
        if mood_filter:
            posts = posts.filter(mood=mood_filter)
        if author_filter:
            posts = posts.filter(author_id=author_filter)
            
        return JsonResponse({
            'posts': [format_post(post) for post in posts]
        })
    
    elif request.method == 'POST':
        # Create new post
        user = get_user_from_token(request)
        if not user:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        try:
            data = json.loads(request.body)
            
            # Validation
            if not data.get('title'):
                return JsonResponse({'error': 'Title is required'}, status=400)
            if len(data['title']) > 200:
                return JsonResponse({'error': 'Title too long (max 200 chars)'}, status=400)
            if not data.get('content'):
                return JsonResponse({'error': 'Content is required'}, status=400)
            if 'mood' in data and data['mood'] not in dict(Post.MOOD_CHOICES).keys():
                return JsonResponse({'error': 'Invalid mood'}, status=400)
                
            post = Post.objects.create(
                title=data['title'],
                content=data['content'],
                author=user,
                mood=data.get('mood', '💻')
            )
            
            return JsonResponse(format_post(post), status=201)
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def post_detail(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)
        
    if request.method == 'GET':
        # Get single post
        return JsonResponse(format_post(post))
        
    elif request.method == 'PUT':
        # Update post
        user = get_user_from_token(request)
        if not user:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        if post.author != user:
            return JsonResponse({'error': 'You can only edit your own posts'}, status=403)
            
        try:
            data = json.loads(request.body)
            updates = {}
            
            if 'title' in data:
                if not data['title']:
                    return JsonResponse({'error': 'Title cannot be empty'}, status=400)
                if len(data['title']) > 200:
                    return JsonResponse({'error': 'Title too long (max 200 chars)'}, status=400)
                post.title = data['title']
                
            if 'content' in data:
                if not data['content']:
                    return JsonResponse({'error': 'Content cannot be empty'}, status=400)
                post.content = data['content']
                
            if 'mood' in data:
                if data['mood'] not in dict(Post.MOOD_CHOICES).keys():
                    return JsonResponse({'error': 'Invalid mood'}, status=400)
                post.mood = data['mood']
                
            post.save()
            return JsonResponse(format_post(post))
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    elif request.method == 'DELETE':
        # Delete post
        user = get_user_from_token(request)
        if not user:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        if post.author != user:
            return JsonResponse({'error': 'You can only delete your own posts'}, status=403)
            
        post.delete()
        return JsonResponse({'message': 'Post deleted successfully'})
        
    return JsonResponse({'error': 'Method not allowed'}, status=405)
