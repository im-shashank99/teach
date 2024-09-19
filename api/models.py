from mongoengine import Document, StringField, DateTimeField

class Chat(Document):
    sender = StringField(required=True)
    text = StringField(required=True)
    timestamp = DateTimeField(required=True)

class Session(Document):
    time = StringField(required=True)
    topic = StringField(required=True)
