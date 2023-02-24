import re
from uuid import UUID

def validate_uuid4(uuid_string):

    """
    Validate that a UUID string is in
    fact a valid uuid4.
    Happily, the uuid module does the actual
    checking for us.
    It is vital that the 'version' kwarg be passed
    to the UUID() call, otherwise any 32-character
    hex string is considered valid.
    """

    try:
        val = UUID(uuid_string, version=4)
    except ValueError:
        # If it's a value error, then the string 
        # is not a valid hex code for a UUID.
        return False

    return val.hex == uuid_string.replace('-', '')

def strip_phone(phone):
    if phone is None or phone == '':
        return ''
         
    return re.sub('[^0-9]+', '', phone)
