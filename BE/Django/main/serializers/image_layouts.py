from rest_framework import serializers
from .common import Metadata

# 책의 메타데이터를 직렬화/역직렬화하는 serializer
class Section(serializers.Serializer):
    type = serializers.ChoiceField(
        choices=[
            ('title', 'Title'),
            ('text', 'Text'),
            ('image', 'Image')
        ],
        help_text="chapter_title, text, image 중 하나"
    )
    text = serializers.ImageField(help_text="텍스트 이미지", required=False)
    image = serializers.ImageField(help_text="일반 이미지", required=False)
    sequence_number = serializers.IntegerField()

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
    sections = serializers.ListSerializer(child=Section())

class ImageLayouts(serializers.Serializer):
    metadata = Metadata()
    pages = serializers.ListSerializer(child=Page())