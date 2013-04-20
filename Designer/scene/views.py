# Create your views here.
from django.shortcuts import render_to_response
from django.template import RequestContext

def  view_scene(request):
	return render_to_response('3D.html')


