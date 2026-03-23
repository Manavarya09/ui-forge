from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('api.urls.auth')),
    path('api/posts/', include('api.urls.posts')),
    path('api/users/', include('api.urls.users')),
]
