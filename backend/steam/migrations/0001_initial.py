# Generated by Django 3.2.2 on 2021-07-16 01:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SteamAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=128)),
                ('password', models.CharField(max_length=128)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steam_accounts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SteamSwap',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('target', models.CharField(max_length=32)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steam_swaps', to='steam.steamaccount')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steam_swaps', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
