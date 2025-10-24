from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decouple import config


class Command(BaseCommand):
    help = 'Cria um superuser padrão se não existir'

    def handle(self, *args, **options):
        User = get_user_model()
        
        username = config('DJANGO_SUPERUSER_USERNAME', default='admin')
        email = config('DJANGO_SUPERUSER_EMAIL', default='admin@notedrop.com')
        password = config('DJANGO_SUPERUSER_PASSWORD', default='admin123')
        
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'✓ Superuser "{username}" criado com sucesso!'
                )
            )
            self.stdout.write(
                self.style.WARNING(
                    f'  Username: {username}\n'
                    f'  Password: {password}\n'
                    f'  IMPORTANTE: Altere a senha em produção!'
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f'✗ Superuser "{username}" já existe. Pulando criação.'
                )
            )
