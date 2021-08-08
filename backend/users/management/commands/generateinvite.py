from django.core.management.base import BaseCommand, CommandError
from users.models import UserInvite

class Command(BaseCommand):
    help = "Generates a random invite code to join the website."
 
    def handle(self, *args, **options):
        invite = UserInvite.objects.create()
        self.stdout.write(self.style.SUCCESS("Generated invite code: " + invite.code))
