from django_eventstream import send_event

def send_sse_message(channel: str, status: str, progress: int):
    print('send_message 안에 들어옴')
    data = {
        'status': status,
        'progress': progress
    }
    send_event(channel, 'message', data)