from django.conf.urls.defaults import patterns, url
from django.views.generic import ListView, DateDetailView, DetailView

from django_comments_xtd.models import XtdComment

from viewcomments.models import MITClass
from viewcomments.views import ClassDetailView
from viewcomments import views

urlpatterns = patterns('',

    url(r'^(?P<slug>[-\w]+)/$', 
        ClassDetailView.as_view(),
        name='mit-class-detail'),

    # list all comments using pagination, newer first
    url(r'^comments$', 
        ListView.as_view(
            queryset=XtdComment.objects.for_app_models("blog.quote"), 
            template_name="django_comments_xtd/blog/comment_list.html",
            paginate_by=5),
        name='class-comments'),

    #url(r'^(?P<slug>[-\w]+)/$', views.back, name='back'),
)
