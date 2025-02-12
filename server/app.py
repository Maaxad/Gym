from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
import os
import re
from flask_jwt_extended import JWTManager, create_access_token
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure the app with environment variables
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret' # Update with a more secure key in production
app.secret_key = 'your_secret_key'

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

# Define the User model for SQLAlchemy
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    age = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "age": self.age
        }

# Helper function to validate email format
def validate_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

# Helper function to validate password complexity
def validate_password(password):
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password): # Check for uppercase
        return False
    if not re.search(r'[a-z]', password): # Check for lowercase
        return False
    if not re.search(r'[0-9]', password): # Check for digit
        return False
    if not re.search(r'[@$!%*?&#]', password): # Check for special character
        return False
    return True

# Helper function to validate age
def validate_age(age):
    if isinstance(age, int) and 18 <= age <= 120:
        return True
    return False

# Registration endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(f"Received data: {data}") # Log the received data for debugging
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    age = data.get("age")

    # Validate fields
    if not username or not email or not password or not age:
        return {"error": "Missing required fields"}, 400

    if not validate_email(email):
        return {"error": "Invalid email format"}, 400

    if not validate_password(password):
        return {"error": "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character"}, 400

    try:
        age = int(age)
    except ValueError:
        return {"error": "Age must be a number"}, 400

    if not validate_age(age):
        return {"error": "Invalid age. Age must be a number between 18 and 120."}, 400

    if User.query.filter_by(email=email).first():
        return {"error": "Email already exists"}, 400

    try:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(
            username=username,
            email=email,
            password=hashed_password,
            age=age,
        )
        db.session.add(new_user)
        db.session.commit()

        # Generate a token for the newly registered user
        access_token = create_access_token(identity=new_user.id)
        return {"token": access_token, "user": new_user.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        print(f"Error during registration: {e}")
        return {"error": "An error occurred during registration. Please try again."}, 500

# Login endpoint (optional, if you need it)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Check if email and password are provided
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    # Find user by email
    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        # Create a JWT token
        access_token = create_access_token(identity=user.id)
        return jsonify({"token": access_token, "user": user.to_dict()}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# Middleware to protect certain routes with authentication
from functools import wraps
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"error": "Token is missing!"}), 403

        try:
            # Remove the 'Bearer ' prefix from the token
            token = token.replace('Bearer ', '')
            decoded_token = jwt.decode_token(token)
            user_id = decoded_token["sub"]
        except Exception as e:
            return jsonify({"error": str(e)}), 403

        return f(user_id, *args, **kwargs)

    return decorated_function

# Example of a protected route that requires authentication
@app.route('/profile', methods=['GET'])
@token_required
def profile(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({"user": user.to_dict()}), 200

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, port=5000) # Flask runs on port 5000