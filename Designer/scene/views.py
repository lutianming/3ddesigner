# Create your views here.
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from scene.models import *
from django.utils import simplejson
from django.views.decorators.csrf import csrf_exempt
import time;

@login_required
<<<<<<< HEAD
def  view_scene(request,id):
	scene = get_object_or_404(SceneData,id = id)
=======
def  view_scene(request):
	return render_to_response('scene/view_scene.html',context_instance=RequestContext(request))
>>>>>>> c8d02fe7e485f4eade01681a6e993336da784567

	context = RequestContext(request,{
			'type' : 'view',
			'scene': scene
		})

	return render_to_response('view_scene.html',context_instance = context)

def new_scene(request):
	context = RequestContext(request,{
			'type' : 'edit'
		})
	return render_to_response('view_scene.html',context_instance = context)

def edit_scene(request , id):
	scene = get_object_or_404(SceneData, id = id)
	context = RequestContext(request,{
			'type' : 'edit',
			'scene' : scene
		})
	return render_to_response('view_scene.html',context_instance = context)


@login_required
@csrf_exempt
def save_scene(request):
	if request.method == 'POST':
		title = request.POST['title']
		time = get_time_string()
		description = request.POST['description']
		content = request.POST['content']
		authorId = request.user.id
		sceneId = request.POST['sceneId']
		isDraft = request.POST['draft']
		# imgUrl = request.POST['imgUrl']

		if isDraft == 'true' :
			sceneDraft = SceneDraft(title=title , time=time , description=description , content=content , author_id=authorId , scene_id=sceneId)
			sceneDraft.save()
			json = {'code':1, 'draftId':sceneDraft.id}
			return HttpResponse(simplejson.dumps(json))

		scene = SceneData(title=title , time=time , description=description , content=content, author_id=authorId )#, img_url=imgUrl )
		scene.save()
		return HttpResponseRedirect('/scene/' + str(scene.id))

	json = {'code': 0}
	return HttpResponse(simplejson.dumps(json))


def get_time_string():
	return time.strftime('%Y-%m-%d',time.localtime(time.time()))
