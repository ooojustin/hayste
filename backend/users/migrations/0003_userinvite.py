# Generated by Django 3.2.2 on 2021-07-15 20:26

import common.utils
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_customuser_email'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserInvite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default=common.utils.generate_invite_code, max_length=32)),
                ('used', models.DateTimeField(default=None, null=True)),
                ('user', models.OneToOneField(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='invite', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]