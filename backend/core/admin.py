from django.contrib import admin
from .models import User, Event, Room, Team
from django.contrib.auth.admin import UserAdmin

# Register your models here.
@admin.register(User)
class UserAdmin(UserAdmin):
    pass

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'time', 'user', 'room', '_group')
    search_fields = ('name', )

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('number', 'description')
    search_fields = ('number', )

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', )
    search_fields = ('name', )