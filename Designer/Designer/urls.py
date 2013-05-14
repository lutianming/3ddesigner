from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *
from message.views import *
from home.views import *
from gallery.views import *
from scene.views import *
import settings
import os
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

#site_media2 = os.path.join(os.path.dirname(__file__),'/site_media/js/tiny_mce/plugins/emotions/img')

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Designer.views.home', name='home'),
    # url(r'^Designer/', include('Designer.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^msg/(?P<page>\d*)$', msg_list_page),
    url(r'^$', go_to_home),
    url(r'^site_media/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_PATH}),
    url(r'^accounts/register/success/$', 'django.views.generic.simple.direct_to_template', {'template': 'registration/register_success.html'}),
    url(r'^accounts/register/$', register_page),
    url(r'^accounts/login/$','django.contrib.auth.views.login'),
    url(r'^accounts/profile/$',go_to_home),
    url(r'^accounts/logout/$','django.contrib.auth.views.logout', {'next_page':'/'}),
    url(r'^accounts/password/change/$','django.contrib.auth.views.password_change',{'template_name':'registration/password_change.html'}),
    url(r'^accounts/password/change/done/$', 'django.contrib.auth.views.password_change_done',{'template_name':'registration/password_change_success.html'}),
    url(r'^accounts/password/reset/$','django.contrib.auth.views.password_reset',{'template_name':'registration/password_reset_form.html'}),
    url(r'^accounts/password/reset/done/$', 'django.contrib.auth.views.password_reset_done',{'template_name':'registration/password_reset_success.html'}),
    url(r'^post/$', msg_post_page),
    url(r'^user/(?P<username>\w+)/msg/(?P<page>\d*)$', user_msg_list_page),
    url(r'^user/(?P<username>\w+)/work/(?P<page>\d*)$', user_work_list_page),
    url(r'^detail/(\d+)/$', msg_detail_page),
    #url(r'^detail/site_media/js/tiny_mce/plugins/emotions/img/(?P<path>.*)$','django.views.static.serve',{'document_root':site_media2}),
    url(r'^comments/',include('django.contrib.comments.urls')),
    url(r'^user/profile/(?P<username>.*)', get_user_profile),
    url(r'^post/autosave/$', autosave),
    url(r'^post/restore/$', restore),
    url(r'^gallery/(?P<page>\d*)$', gallery_page),
    url(r'^scene/getscenelist/(?P<page>\d+)$',ajax_get_more_scene),
    url(r'^scene/getallscenelist/(?P<page>\d+)$',ajax_get_all_more_scene),
    url(r'^scene/(?P<id>\d+)$',view_scene),
    url(r'^scene/new/$',new_scene),
    url(r'^scene/save/$',save_scene),
    url(r'^scene/edit/(?P<id>\d+)$',edit_scene),
    url(r'^msg_delete/(?P<id>\d+)$',msg_delete),
    url(r'^getAllModels/$',getModels),
    url(r'^scene/delete/(?P<id>\d+)$',deleteScene),
    url(r'^manage/testModel/$',testModel),
    url(r'^manage/ajaxUploadModel/$',ajaxUploadModel)
)
