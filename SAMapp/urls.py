from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('process/', views.process, name='process'),
    path('add_image/', views.add_image, name='add_image'),
    path('update_image/<int:image_id>/', views.update_image, name='update_image'),
    path('delete_image/<int:image_id>/', views.delete_image, name='delete_image'),
    path('get_images/', views.get_images, name='get_images'),
]
