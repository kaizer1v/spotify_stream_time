import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyOAuth

scope = "user-library-read user-top-read"
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))

to_seconds = 1000
to_minutes = 60 * to_seconds
to_hours = 60 * to_minutes
to_days = to_hours * 24
df_0 = pd.read_json('endsong_0.json', orient='records')
df_1 = pd.read_json('endsong_1.json', orient='records')
df_2 = pd.read_json('endsong_2.json', orient='records')
df_3 = pd.read_json('endsong_3.json', orient='records')
df = pd.concat([df_0, df_1, df_2, df_3])

# transformations
df['ts'] = pd.to_datetime(df['ts'])
df['year'] = df['ts'].dt.year
df['month'] = df['ts'].dt.month
df['day'] = df['ts'].dt.day
df['hour'] = df['ts'].dt.hour
df['minute'] = df['ts'].dt.minute
df['seconds'] = df['ts'].dt.second
df['time'] = df['ts'].dt.time
df['day_of_week'] = df.ts.dt.dayofweek

col_mapping = {
    'artist': 'master_metadata_album_artist_name',
    'album': 'master_metadata_album_album_name',
    'track': 'master_metadata_track_name'
}

def basic():
    return sp.audio_features(top_uris)

def get_top(col):
    # df = final_df
    return (df.groupby(col_mapping[col])['ms_played'].sum().sort_values(ascending=False).head(10) / to_hours).reset_index().to_json(orient='records')

def get_top_by_year(col, top=5):
    # df = final_df
    agg_1 = df.groupby(['year', col_mapping[col]]).agg({'ms_played': sum}) / to_hours
    return agg_1['ms_played'].groupby(['year'], group_keys=False).nlargest(top).reset_index().to_json(orient='records')

def get_specific(col, val):
    if col != 'album':
        return (df[df[col_mapping[col]] == val].groupby('year').agg({'ms_played': sum}) / to_hours).reset_index().to_json(orient='records')
    else:
        album_df = df[df[col_mapping[col]].str.contains(val) == True]
        return (album_df.groupby('year').agg({'ms_played': sum}) / to_hours).reset_index().to_json(orient='records')

def get_period(period='month'):
    return (df.groupby(period).agg({'ms_played': sum}) / to_hours).reset_index().to_json(orient='records')

