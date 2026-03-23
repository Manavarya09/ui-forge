from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostListCreate.as_view(), name='post-list-create'),
    path('<int:pk>', views.PostUpdateDelete.as_view(), name='post-update-delete'),
]
