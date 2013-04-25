# Create your views here.
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required

@login_required
def  view_scene(request):
	return render_to_response('view_scene.html',context_instance=RequestContext(request))


