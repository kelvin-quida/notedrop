from django.urls import path
from . import views

urlpatterns = [
    path('', views.MessageListCreateView.as_view(), name='message-list-create'),
    path('<int:pk>/', views.MessageUpdateView.as_view(), name='message-update'),
    path('<int:pk>/delete/', views.MessageDeleteView.as_view(), name='message-delete'),
    path('export.xlsx', views.MessageExportView.as_view(), name='message-export'),
]



