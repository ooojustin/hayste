from django.http import HttpResponse

def index(request):
   text = "<h1>hayste.co</h1>"
   return HttpResponse(text)
