# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Book(models.Model):
    book_id = models.BigAutoField(primary_key=True)
    category = models.ForeignKey('Category', models.DO_NOTHING)
    member = models.ForeignKey('Member', models.DO_NOTHING, blank=True, null=True)
    title = models.TextField()
    cover = models.TextField()
    cover_alt = models.TextField()
    author = models.CharField(max_length=50)
    publisher = models.CharField(max_length=50, blank=True, null=True)
    published_date = models.DateField(blank=True, null=True)
    story = models.TextField(blank=True, null=True)
    isbn = models.CharField(max_length=15, blank=True, null=True)
    my_tts_flag = models.IntegerField()
    epub = models.TextField(blank=True, null=True)
    d_type = models.CharField(max_length=10)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = 'book'


class BookCart(models.Model):
    book = models.OneToOneField(Book, models.DO_NOTHING, primary_key=True)  # The composite primary key (book_id, member_id) found, that is not supported. The first column is selected.
    member = models.ForeignKey('Member', models.DO_NOTHING)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'book_cart'
        unique_together = (('book', 'member'),)


class Category(models.Model):
    category_id = models.CharField(primary_key=True, max_length=10)
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    category_name = models.CharField(max_length=50)
    level = models.CharField(max_length=6)

    class Meta:
        managed = False
        db_table = 'category'


class Likes(models.Model):
    book = models.OneToOneField(Book, models.DO_NOTHING, primary_key=True)  # The composite primary key (book_id, member_id) found, that is not supported. The first column is selected.
    member = models.ForeignKey('Member', models.DO_NOTHING)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'likes'
        unique_together = (('book', 'member'),)


class Member(models.Model):
    member_id = models.BigAutoField(primary_key=True)
    email = models.CharField(unique=True, max_length=320)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=18)
    nickname = models.CharField(max_length=15)
    birth = models.DateField()
    gender = models.CharField(max_length=1)
    blind_flag = models.IntegerField()
    delete_flag = models.IntegerField()
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'member'


class Note(models.Model):
    note_id = models.BigAutoField(primary_key=True)
    book = models.ForeignKey(Book, models.DO_NOTHING)
    member = models.ForeignKey(Member, models.DO_NOTHING)
    sentence_id = models.CharField(max_length=20)
    progress_rate = models.FloatField()
    created_at = models.DateTimeField()
    sentence = models.TextField()

    class Meta:
        managed = False
        db_table = 'note'


class Review(models.Model):
    review_id = models.BigAutoField(primary_key=True)
    book = models.ForeignKey(Book, models.DO_NOTHING)
    member = models.ForeignKey(Member, models.DO_NOTHING)
    score = models.IntegerField()
    content = models.CharField(max_length=500)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'review'


class ViewLog(models.Model):
    log_id = models.BigAutoField(primary_key=True)
    member = models.ForeignKey(Member, models.DO_NOTHING)
    book = models.ForeignKey(Book, models.DO_NOTHING)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'view_log'
