import time

class RequestLogger:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration = int((time.time() - start_time) * 1000)
        print(f"{request.method} {request.path} - {duration}ms")
        return response