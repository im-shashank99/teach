from flask import Blueprint, request, jsonify
from models import Chat, Session

session_bp = Blueprint('session', __name__)

# Chat message saving API
@session_bp.route('/messages', methods=['POST'])
def save_message():
    data = request.json
    chat_message = Chat(sender=data['sender'], text=data['text'], timestamp=data['timestamp'])
    chat_message.save()
    return jsonify({'message': 'Message saved'}), 200

# Session schedule API
@session_bp.route('/schedule', methods=['GET'])
def get_schedule():
    sessions = Session.objects().to_json()
    return sessions, 200
