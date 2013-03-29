from home.forms import RegistrationForm
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.core.context_processors import csrf
from django.contrib.auth.models import User

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