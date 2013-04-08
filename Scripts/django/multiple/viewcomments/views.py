from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.generic import DateDetailView, DetailView

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
    
