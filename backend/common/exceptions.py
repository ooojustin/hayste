class SteamAccountLoginException(Exception):
    """
    Indicates that an error occurred when logging into a steam account.
    A custom HTTP response code is returned if the frontend needs to handle this.
    """
    status_code = 470
