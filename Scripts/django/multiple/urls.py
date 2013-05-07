from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from django.contrib.comments.feeds import LatestCommentFeed

from django.views.generic import ListView, DateDetailView, DetailView

from django_comments_xtd.models import XtdComment

from viewcomments.models import MITClass
from viewcomments.views import ClassDetailView
from viewcomments import views


admin.autodiscover()

urlpatterns = patterns('views',
    url(r'^admin/',           include(admin.site.urls)),
    url(r'^viewcomments/',    include('haystack.urls')),
    url(r'^comments/',        include('django_comments_xtd.urls')),
    url(r'^feeds/comments/$', LatestCommentFeed(), name='comments-feed'),

    url(r'^viewcomments/(?P<slug>[-\w]+)/$',
        ClassDetailView.as_view(),
        name='mit-class-detail'),

    # list all comments using pagination, newer first
    url(r'^viewcomments/comments$',
        ListView.as_view(
            queryset=XtdComment.objects.for_app_models("viewcomments.mitclass"), 
            template_name="django_comments_xtd/blog/comment_list.html",
            paginate_by=5),
        name='class-comments'),

)
