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
    text = serializers.CharField(help_text="base64로 인코딩된 이미지", required=False)
    image = serializers.ImageField(help_text="일반 이미지", required=False)
    sequence_number = serializers.IntegerField()

class Page(serializers.Serializer):
    page_number = serializers.IntegerField()
    sections = Section(many=True)

class ImageLayouts(serializers.Serializer):
    metadata = Metadata()
    pages = Page(many=True)