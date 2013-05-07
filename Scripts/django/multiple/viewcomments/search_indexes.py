from haystack import indexes
from viewcomments.models import MITClass
from django.contrib.comments.models import Comment

class MITClassIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    title = indexes.CharField(model_attr='title', faceted=True)
    description = indexes.CharField(model_attr="description", faceted=True)

    def get_model(self):
        return MITClass

    def index_queryset(self):
        return self.get_model().objects.all()

class CommentIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    package = indexes.CharField(model_attr='object_pk', faceted=True)

    def get_model(self):
	return Comment

    def index_queryset(self):
        return self.get_model().objects.all()
