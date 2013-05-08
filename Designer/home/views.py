from home.forms import RegistrationForm
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.core.context_processors import csrf
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator
from django.utils import simplejson
from django.http import HttpResponse
from scene.models import *
from django.contrib.auth.decorators import login_required

def register_page(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password1'],
                email=form.cleaned_data['email'],
                )
            return HttpResponseRedirect('/accounts/register/success/')
    else:
        form = RegistrationForm()
    return render_to_response('registration/register.html',{'form':form}, context_instance=RequestContext(request))

def go_to_home(request):
    return render_to_response('home/home.html',context_instance=RequestContext(request))

def get_user_profile(request, username):
    user = get_object_or_404(User, username=username)
    msgpage_number = 1;
    
    if request.method == "POST":
        msgpage_number = int(request.POST['page']);
        return HttpResponseRedirect('/user/'+username+'/'+str(msgpage_number));  
    
    def previous_page_number():
            if paginator.num_pages == 0:
                return 0
            elif msgpage_number ==1:
                return 1
            else:
                return page_obj.previous_page_number()
            
    def next_page_number():
            if paginator.num_pages == 0:
                return 0
            elif msgpage_number == paginator.num_pages:
                return paginator.num_pages
            else:
                return page_obj.next_page_number()
            
    def get_user_msg_list():
        if user_msg_list:
            return page_obj.object_list
        else:
            return None
    
    def get_user_work_list():
        return None
        
    user_msg_list = user.msg_set.order_by('-id')
    paginator = Paginator(user_msg_list,3)    


    userId = user.id
    sceneList = get_scene_list(userId,1) #SceneData.objects.filter(author_id=request.user.id)[0:9]

    page_obj = paginator.page(msgpage_number)
    c = RequestContext(request, {
            'msg_list': get_user_msg_list,
            'username':username,
            'user':user,
            'sceneList' : sceneList
        })
        
    return render_to_response('profile/user_profile.html', c)

def ajax_get_more_scene(request,page):
    userId = request.user.id
    sceneList = get_scene_list(userId,page);

    context = RequestContext(request,{
            'sceneList' : sceneList
        })

    return render_to_response('profile/work_list.html',context)



def get_scene_list(user_id,page):
    start = (int(page)-1)*9
    end =(int(page))*9
    sceneList = SceneData.objects.filter(author_id=user_id)[start : end]

    for scene in sceneList:
        scene.htitle = scene.title[:12]
        if len(scene.title) > 12 :
            scene.htitle += '...'
    return sceneList