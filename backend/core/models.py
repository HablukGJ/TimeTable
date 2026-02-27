from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
# Create your models here.

class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='core_user_set',  # уникальное имя обратной связи
        blank=True,
        help_text='The groups this user belongs to.'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='core_user_set_permissions',  # уникальное имя обратной связи
        blank=True,
        help_text='Specific permissions for this user.'
    )
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

class Team(models.Model):
    name = models.CharField(max_length=255)
    users = models.ManyToManyField('User', related_name='custom_groups')

    class Meta:
        verbose_name = "Группа"
        verbose_name_plural = "Группы"

    def __str__(self):
        return self.name

class Room(models.Model):
    number = models.IntegerField()
    description = models.TextField()
    users = models.ManyToManyField('User', related_name='rooms')

    class Meta:
        verbose_name = "Комната"
        verbose_name_plural = "Комнаты"

    def __str__(self):
        return f"{self.number}: {self.description[:50]}"


class Event(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='events')
    _group = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='events')

    class Meta:
        verbose_name = "Событие"
        verbose_name_plural = "События"

    def __str__(self):
        return f"{self.name} — {self.date} {self.time}"