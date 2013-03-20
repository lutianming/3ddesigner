from forms import *
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.core.context_processors import csrf
import re 

def register_page(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = User.objects.create(
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name'],
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password1'],
                email=form.cleaned_data['email'],
                )
            return HttpResponseRedirect('/user/register/success/')
    else:
        form = RegistrationForm()
    return render_to_response('registration/register.html',{'form':form}, context_instance=RequestContext(request))

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect('/user/login/success/'+form.cleaned_data['username'])
    else:
        form = LoginForm()
    return render_to_response('registration/login.html',{'form':form}, context_instance=RequestContext(request))

def user_page(request, username):
    user = User.objects.get(username=username)
    return render_to_response('registration/user_page.html',{'user':user})
    
    
    
    