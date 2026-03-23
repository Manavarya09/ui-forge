from rest_framework import serializers
from .models import User, Post
import bcrypt

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        user.save()
        return user
    
    class Meta:
        model = User
        fields = ['email', 'password', 'name']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'published', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
