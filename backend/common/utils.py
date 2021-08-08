import string, random, time

def timestamp_ms():
    """Returns current unix timestamp, in millseconds."""
    return round(time.time() * 1000)

def generate_invite_code():
    return random_string(length = 32)

def random_string(length = 16):
    chars = string.ascii_letters + string.digits
    return "".join(random.choice(chars) for i in range(length))
