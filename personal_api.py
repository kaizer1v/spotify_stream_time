'''
Personal API

Use the `SpotifyOAuth` class for authentication to access user's personal API
will require you to run the following commands on terminal (to define global variables)

export SPOTIPY_CLIENT_ID='your-spotify-client-id'
export SPOTIPY_CLIENT_SECRET='your-spotify-client-secret'
export SPOTIPY_REDIRECT_URI='your-app-redirect-url'
'''
import spotipy
from spotipy.oauth2 import SpotifyOAuth

scope = "user-library-read user-top-read"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))

# print(sp.current_user_saved_tracks())
print(sp.current_user())
