from slowapi import Limiter
from slowapi.util import get_remote_address

# Use the client's IP address to track request limits
limiter = Limiter(key_func=get_remote_address)