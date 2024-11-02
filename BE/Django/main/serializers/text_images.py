from rest_framework import serializers
from .common import Metadata

class Content(serializers.Serializer):
    texts = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=True,
        required=False
    )
    image = serializers.ImageField(required=False)

class Section(serializers.Serializer):
    type = serializers.ChoiceField(
        choices=[
            ('title', 'Title'),
            ('text', 'Text'),
            ('image', 'Image')
        ],
        help_text="title, text, image 중 하나"
    )
    sequence = serializers.IntegerField()
    content = Content()

class Page(serializers.Serializer):
    page_number = serializers.IntegerField()
    layout = serializers.ChoiceField(
        choices=[
            ('text_only', 'Text_Only'),
            ('image_only', 'Image_Only'),
            ('mixed', 'Mixed')
        ],
        help_text="text_only, image_only, mixed 중 하나"
    )
    sections = Section(many=True)

class TextImages(serializers.Serializer):
    metadata = Metadata()
    pages = Page(many=True)