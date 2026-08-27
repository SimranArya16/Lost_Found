from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """POST /api/accounts/register/"""
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        token['is_staff'] = user.is_staff
        return token


class LoginView(TokenObtainPairView):
    """POST /api/accounts/login/  -> returns access + refresh tokens"""
    serializer_class = CustomTokenObtainPairSerializer


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/accounts/me/  -> current logged-in user's profile"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """GET /api/accounts/users/  -> admin-only list of all users"""
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]