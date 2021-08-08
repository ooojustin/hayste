from django.http import HttpResponse

def index(request):
   text = "<h1>steamid.shop</h1>"
   return HttpResponse(text)
