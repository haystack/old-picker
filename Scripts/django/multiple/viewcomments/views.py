from __future__ import absolute_import

from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.generic import DateDetailView, DetailView

from django import template
from django.conf import settings
from django.contrib import comments
from django.shortcuts import get_object_or_404, render_to_response
from django.core.mail import send_mail

from viewcomments.models import MITClass

class ClassDetailView(DetailView):
    model = MITClass
    slug_field = "slug"

    def get_context_data(self, **kwargs):
        context = super(ClassDetailView, self).get_context_data(**kwargs)
        context.update({'next': reverse('comments-xtd-sent')})
        return context

def back(request):
    return render_to_response('mitclass_detail.html',
                              {'backquery': History.objects.get(comments_page=slug).queries})

def flag(request, comment_id, next=None):
    """
    Flags a comment. 
    """
    comment = get_object_or_404(comments.get_model(), pk=comment_id, site__pk=settings.SITE_ID)

    if comment.user_url != "" and comment.user_url != None:
        flag = int(comment.user_url)
        flag += 1
        comment.user_url = str(flag)
    else:
        comment.user_url = "1"        
    comment.save()
    next_url = "http://picker.scripts.mit.edu/" + comment.get_absolute_url()
    
    send_mail('Flagged Comment', 'A comment has been flagged:   ' + comment.get_as_text(), 'course-picker@lists.csail.mit.edu', ['picker-www@mit.edu'], fail_silently=True) 
    return HttpResponseRedirect(next_url)
