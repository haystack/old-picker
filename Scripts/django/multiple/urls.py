from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from django.contrib.comments.feeds import LatestCommentFeed


admin.autodiscover()

urlpatterns = patterns('views',
    url(r'^admin/',           include(admin.site.urls)),
    url(r'^viewcomments/',    include('viewcomments.urls')),
    url(r'^comments/',        include('django_comments_xtd.urls')),
    url(r'^feeds/comments/$', LatestCommentFeed(), name='comments-feed'),
)
