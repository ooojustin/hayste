# Generated by Django 3.2.2 on 2021-07-22 15:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('steam', '0006_alter_steamswap_node'),
    ]

    operations = [
        migrations.AddField(
            model_name='steamswap',
            name='claimed',
            field=models.BooleanField(default=None, null=True),
        ),
    ]
