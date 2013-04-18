from django.shortcuts import render_to_response
from django.template import RequestContext

def gallery_page(request):
    return render_to_response('gallery/gallery.html',context_instance=RequestContext(request))