from django.conf.urls import patterns, include, url
from homepage.views import *
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Backstage.views.home', name='home'),
    # url(r'^Backstage/', include('Backstage.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^3DDesigner/$','django.views.generic.simple.direct_to_template', {'template': 'registration/index.html'}),
    url(r'^user/register/success/$', 'django.views.generic.simple.direct_to_template', {'template': 'registration/register_success.html'}),
    url(r'^user/register/$', register_page),
    url(r'^user/login/$',login_view),
    url(r'^user/logout/$','django.contrib.auth.views.logout', {'next_page':''}),
    url(r'^3DDesigner/(?P<username>\w+)/$', user_page), 
    url(r'^user/login/success/(?P<username>\w+)$', 'django.views.generic.simple.direct_to_template', {'template': 'registration/login_success.html'}),
)
