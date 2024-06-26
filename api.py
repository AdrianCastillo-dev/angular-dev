from flask import Flask, jsonify, request
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas

def get_db_connection():
    """Establece la conexión con la base de datos MySQL."""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='practica',
            user='root',
            password=''
        )
        return connection
    except Error as e:
        raise Exception(f"Error connecting to MySQL: {e}")

@app.route('/users', methods=['GET'])
def get_users():
    """Obtiene todos los usuarios."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        return jsonify(users)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    """Obtiene un usuario por ID."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE id = %s", (id,))
        user = cursor.fetchone()
        if user:
            return jsonify(user)
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/users', methods=['POST'])
def add_user():
    """Agrega uno o más usuarios."""
    user_details_list = request.json
    if not isinstance(user_details_list, list):
        return jsonify({'error': 'Invalid input'}), 400
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        for user_details in user_details_list:
            if 'name' not in user_details or 'pass' not in user_details or 'email' not in user_details:
                return jsonify({'error': 'Invalid input'}), 400
            cursor.execute("INSERT INTO users (name, pass, email) VALUES (%s, %s, %s)", 
                           (user_details['name'], user_details['pass'], user_details['email']))
        connection.commit()
        return jsonify({'message': 'Users added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    """Actualiza un usuario por ID."""
    user_details = request.json
    if not user_details or 'name' not in user_details or 'pass' not in user_details or 'email' not in user_details:
        return jsonify({'error': 'Invalid input'}), 400
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("UPDATE users SET name = %s, email = %s, pass = %s WHERE id = %s", 
                       (user_details['name'], user_details['email'], user_details['pass'], id))
        connection.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'message': 'User updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    """Elimina un usuario por ID."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("DELETE FROM users WHERE id = %s", (id,))
        connection.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'message': 'User deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/users/login', methods=['POST'])
def login():
    """Autentica un usuario."""
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Invalid input'}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s AND pass = %s", (email, password))
        user = cursor.fetchone()
        if user:
            return jsonify({'message': 'Login successful', 'user': user})
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
