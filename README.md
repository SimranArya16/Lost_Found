# College Lost & Found Management System

A full-stack web application that helps college students report, search, and recover lost and found items such as ID cards, books, wallets, and electronic devices.

## Features

- User registration and login
- JWT-based authentication
- Report lost and found items
- Upload images of items
- Search and filter items
- Track item status
- View personal reports
- View reporter contact information
- Admin panel for managing users and items
- Protected routes and user permissions
- Responsive user interface


## Tech Stack

Frontend: React.js, React Router, Axios, Bootstrap 5, Vite, JavaScript, CSS

Backend: Python, Django, Django REST Framework, Simple JWT, MySQL, Pillow, django-cors-headers, django-filter

## Installation

Clone the repository:

git clone https://github.com/SimranArya16/Lost_Found.git

cd Lost_Found

### Backend Setup

cd back_manage

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

Create a `.env` file using `.env.example` and add your database configuration.

Run migrations:

python manage.py migrate

Create an admin account:

python manage.py createsuperuser

Start the backend server:

python manage.py runserver

Backend: http://127.0.0.1:8000/

### Frontend Setup

Open a new terminal and run:

cd front_manage

npm install

npm run dev

Frontend: http://localhost:5173/

## API Endpoints

POST /api/accounts/register/ - Register a new user

POST /api/accounts/login/ - User login

POST /api/accounts/login/refresh/ - Refresh JWT token

GET /api/accounts/me/ - Get current user

GET /api/items/ - Get all items

POST /api/items/ - Create an item report

GET /api/items/{id}/ - Get item details

PATCH /api/items/{id}/ - Update an item

DELETE /api/items/{id}/ - Delete an item

GET /api/items/my_reports/ - Get user's reports

## Search and Filtering

Items can be searched and filtered by keyword, category, item type, status, and location.

Example:

/api/items/?search=wallet

## Admin Panel

Administrators can manage users and item reports through the Django admin panel.

http://127.0.0.1:8000/admin/

## Future Improvements

- Email notifications
- Better lost and found item matching
- Location-based search
- Improved admin dashboard
- Cloud image storage
- Production deployment

