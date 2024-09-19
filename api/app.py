from flask import Flask, jsonify
from flask_socketio import SocketIO
from flask_mongoengine import MongoEngine
from routes.session import session_bp  # Import the session blueprint
from root import create_app

# Create the Flask app using the factory method
api = create_app()

# MongoDB connection setup (add this configuration inside create_app() for consistency)
api.config['MONGODB_SETTINGS'] = {
    'db': 'videochat',
    'host': 'localhost',
    'port': 27017
}

# Initialize MongoEngine for MongoDB
db = MongoEngine(api)

# Initialize SocketIO for real-time functionality
socketio = SocketIO(api, cors_allowed_origins="*")

# Register session routes
api.register_blueprint(session_bp)

# Home route (optional)
@api.route('/')
def home():
    return jsonify({"message": "Welcome to the chat and video session app!"})

# Handle Socket.io events for real-time chat
@socketio.on('message')
def handle_message(msg):
    print(f'Received message: {msg}')
    socketio.emit('message', msg)  # Broadcast message to all clients

# Run the Flask app with SocketIO
if __name__ == "__main__":
    socketio.run(api, debug=True)
