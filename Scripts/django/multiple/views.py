from django.shortcuts import render_to_response as render
from django.template import RequestContext

def contact_v(request):
    return render("contact.html", context_instance=RequestContext(request))
