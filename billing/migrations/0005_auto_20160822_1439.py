# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-08-22 04:39
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0004_auto_20160821_2122'),
    ]

    operations = [
        migrations.RenameField(
            model_name='plan',
            old_name='max_required_user',
            new_name='max_num_user',
        ),
        migrations.RenameField(
            model_name='plan',
            old_name='min_required_user',
            new_name='min_required_num_user',
        ),
    ]
