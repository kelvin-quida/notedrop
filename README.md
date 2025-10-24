# 📝 Note Drop

Aplicação web para envio e gerenciamento de mensagens curtas, com backend em Django REST Framework e frontend em React com TypeScript.

## 🚀 Principais Recursos

- Envio e listagem de mensagens
- Ordenação por data de criação
- Exportação para Excel
- Interface responsiva
- API RESTful



## 🚀 Iniciando

1. **Clone o repositório**
   ```bash
   git clone https://github.com/kelvin-quida/notedrop
   cd notedrop
   ```

2. **Inicie os containers**
   ```bash
   docker-compose up --build
   ```

3. **Acesse**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000
   - Admin: http://localhost:8000/admin


## 🐳 Serviços Docker

### db (PostgreSQL)
- **Porta**: 5432
- **Banco**: notedrop_db
- **Usuário**: notedrop_user
- **Senha**: notedrop_password

### api (Django)
- **Porta**: 8000
- **Health Check**: Aguarda PostgreSQL estar pronto
- **Volumes**: Código fonte montado para desenvolvimento

### web (React)
- **Porta**: 3000
- **Dependência**: Aguarda API estar disponível
- **Volumes**: Código fonte montado para desenvolvimento

## 🧪 Testes

O projeto possui uma suíte completa de testes em 3 níveis:

### 📊 Pirâmide de Testes
- **Testes Unitários** - Models e Serializers (pytest)
- **Testes de Integração** - API endpoints (pytest)
- **Testes E2E** - Fluxo completo (Playwright)

### Executar Testes

#### Backend (Unitários + Integração)
```bash
# Pytest
docker-compose exec api pytest

# Padrão do Django
docker-compose exec api python manage.py test
```

#### E2E (End-to-End)
```bash
docker-compose run --rm e2e
```

### 📈 Cobertura
- Meta: **90%+** de cobertura de código
- Relatório: `backend/htmlcov/index.html`

---

## 🧪 API Swagger

### Swagger UI
Acesse a documentação interativa da API:
- **Swagger:** http://localhost:8000/
- **ReDoc:** http://localhost:8000/redoc/
- **OpenAPI Schema:** http://localhost:8000/api/schema/

## 🔧 Comandos Úteis

### Parar os containers
```bash
docker-compose down
```

### Parar e remover volumes (limpa o banco de dados)
```bash
docker-compose down -v
```

### Ver logs dos containers
```bash
# Todos os serviços
docker-compose logs -f

# Apenas API
docker-compose logs -f api

# Apenas Frontend
docker-compose logs -f web
```

### Executar comandos Django
```bash
# Criar migrações
docker-compose exec api python manage.py makemigrations

# Aplicar migrações
docker-compose exec api python manage.py migrate

# Criar superusuário
docker-compose exec api python manage.py createsuperuser

# Shell Django
docker-compose exec api python manage.py shell
```

### Acessar o container
```bash
# Backend
docker-compose exec api bash

# Frontend
docker-compose exec web sh

# Banco de dados
docker-compose exec db psql -U notedrop_user -d notedrop_db
```

## 🛠️ Stack Técnica

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- PostgreSQL 15
- openpyxl 3.1.2

### Frontend
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.1.11
- Tailwind CSS 4.1.15

### Infraestrutura
- Docker e Docker Compose
- PostgreSQL
- Pytest e Playwright para testes

