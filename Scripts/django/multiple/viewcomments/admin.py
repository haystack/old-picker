from django.contrib import admin

from viewcomments.models import MITClass

class MITClassAdmin(admin.ModelAdmin):
    list_display  = ('number_name', 'title', 'semester')
    list_filter   = ('number_name',)
    search_fields = ('number_name', 'title')
    prepopulated_fields = {'slug': ('number_name',)}
    fieldsets = ((None, 
                  {'fields': ('number_name', 'slug', 'title', 'description', 'instructors',
                              'prereqs', 'classtype', 'units', 'semester')}),)

admin.site.register(MITClass, MITClassAdmin)
