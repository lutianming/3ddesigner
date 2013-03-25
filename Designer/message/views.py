from models import Msg
from django.views.generic import list_detail
from forms import MsgPostForm
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.core.context_processors import csrf
from django.core.paginator import Paginator
from django.contrib.auth.models import User

ITEMS_PER_PAGE = 2

def msg_list_page(request, page):
    #return list_detail.object_list(
           # request,
            #queryset=Msg.objects.order_by('-id'),
            #page=2,
            #paginate_by=ITEMS_PER_PAGE,
            #template_name='msg_list_page.html',
           # template_object_name='msg'
            #)
    page_number = 1;
    
    if request.method == "POST":
        page_number = int(request.POST['page']);
        return HttpResponseRedirect('/msg/'+str(page_number));  
    
    def previous_page_number():
            if paginator.num_pages == 0:
                return 0
            elif page_number ==1:
                return 1
            else:
                return page_obj.previous_page_number()
            
    def next_page_number():
            if paginator.num_pages == 0:
                return 0
            elif page_number == paginator.num_pages:
                return paginator.num_pages
            else:
                return page_obj.next_page_number()
            
    def get_msg_list():
        if msg_list:
            return page_obj.object_list
        else:
            return None
    msg_list = Msg.objects.all()
    paginator = Paginator(msg_list,ITEMS_PER_PAGE)
    if page:
        page_number = int(page);
    #else:
        #page_number = 1
    page_obj = paginator.page(page_number)
    c = RequestContext(request, {
            'msg_list': get_msg_list,
            'paginator': paginator,
            'page_obj': page_obj,
            'is_paginated': page_obj.has_other_pages(),
            'results_per_page': paginator.per_page,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'page': page_obj.number,
            'next': next_page_number(),
            'previous': previous_page_number(),
            'first_on_page': page_obj.start_index(),
            'last_on_page': page_obj.end_index(),
            'pages': paginator.num_pages,
            'hits': paginator.count,
            'page_range': paginator.page_range,
        })
        
    return render_to_response('msg_list_page.html', c)


@login_required
def msg_post_page(request):
    if request.method == 'POST':
        form = MsgPostForm(request.POST)
        if form.is_valid():
            newmessage = Msg.objects.create(title=form.cleaned_data['title'],content=form.cleaned_data['content'],user=request.user,ip=request.META['REMOTE_ADDR'])
            newmessage.save()  
            return HttpResponseRedirect('/msg/')  
    else:
        form = MsgPostForm()
        return render_to_response('msg_post_page.html',{'form':form}, context_instance=RequestContext(request))
        
def user_msg_list_page(request,username,page):
    user = get_object_or_404(User, username=username)
    #return list_detail.object_list(
            #request,
            #queryset=user.msg_set.order_by('-id'),
            #paginate_by=ITEMS_PER_PAGE,
            #page=2,
            #template_name='user_msg_list_page.html',
            #template_object_name='msg',
            #extra_context={'username':username}
            #)

    page_number = 1;
    if page:
        page_number = int(page);
    
    if request.method == "POST":
        page_number = int(request.POST['page']);
        return HttpResponseRedirect('/user/'+username+'/'+str(page_number));  
    
    def previous_page_number():
            if paginator.num_pages == 0:
                return 0
            elif page_number ==1:
                return 1
            else:
                return page_obj.previous_page_number()
            
    def next_page_number():
            if paginator.num_pages == 0:
                return 0
            elif page_number == paginator.num_pages:
                return paginator.num_pages
            else:
                return page_obj.next_page_number()
            
    def get_user_msg_list():
        if user_msg_list:
            return page_obj.object_list
        else:
            return None
        
    user_msg_list = user.msg_set.order_by('-id')
    paginator = Paginator(user_msg_list,ITEMS_PER_PAGE)    
        
    page_obj = paginator.page(page_number)
    c = RequestContext(request, {
            'msg_list': get_user_msg_list,
            'paginator': paginator,
            'page_obj': page_obj,
            'is_paginated': page_obj.has_other_pages(),
            'results_per_page': paginator.per_page,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'page': page_obj.number,
            'next': next_page_number(),
            'previous': previous_page_number(),
            'first_on_page': page_obj.start_index(),
            'last_on_page': page_obj.end_index(),
            'pages': paginator.num_pages,
            'hits': paginator.count,
            'page_range': paginator.page_range,
            'username':username,
            'user':user
        })
        
    return render_to_response('user_msg_list_page.html', c)

def msg_detail_page(request, message_id):   
    msg = get_object_or_404(Msg, id=message_id)
    msg.clickcount += 1
    msg.save()
    return list_detail.object_detail(
            request,
            queryset=Msg.objects.all(),
            object_id = message_id,
            template_name='msg_detail_page.html',
            template_object_name='msg',
            )
