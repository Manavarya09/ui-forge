from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, Post
from .serializers import RegisterSerializer, UserSerializer, PostSerializer

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'success': True, 'data': {'user': {'id': user.id, 'email': user.email}}}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    import bcrypt
    if bcrypt.checkpw(password.encode(), user.password.encode()):
        return Response({'success': True, 'data': {'token': 'dummy-token'}})
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout(request):
    return Response({'success': True, 'message': 'Logged out successfully'})

class PostListCreate(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    
    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    
    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)

@api_view(['GET', 'PUT'])
def user_me(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response({'success': True, 'data': serializer.data})
    
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'success': True, 'data': serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
