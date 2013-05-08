from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from scene.models import *
from django.core.paginator import Paginator

ITEMS_PER_PAGE = 1

def gallery_page(request,page):
    sceneList = get_scene_list(1) #SceneData.objects.filter(author_id=request.user.id)[0:9]
    c = RequestContext(request, {
            'sceneList' : sceneList
        })
    return render_to_response('gallery/gallery.html',c)

def ajax_get_all_more_scene(request,page):
    sceneList = get_scene_list(page);

    context = RequestContext(request,{
            'sceneList' : sceneList
        })

    return render_to_response('profile/work_list.html',context)



def get_scene_list(page):
    start = (int(page)-1)*9
    end =(int(page))*9
    sceneList = SceneData.objects.all()[start : end]

    for scene in sceneList:
        scene.htitle = scene.title[:12]
        if len(scene.title) > 12 :
            scene.htitle += '...'
    return sceneList