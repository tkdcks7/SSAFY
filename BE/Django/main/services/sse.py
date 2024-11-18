from django_eventstream import send_event
import json

def send_sse_message(channel: str, status: str, progress: int):
    print('send_message 안에 들어옴')
    data = {
        'status': status,
        'progress': progress
    }
    encoded_data = json.loads(json.dumps(data, ensure_ascii=False))
    send_event(channel, 'message', encoded_data)