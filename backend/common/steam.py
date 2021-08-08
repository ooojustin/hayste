import requests, re, json

def get_profile_data(steam_id = None, custom_url = None, src = None):


    if not src:
        
        url = "https://steamcommunity.com/"
        if steam_id:
            url += f"profiles/{steam_id}"
        elif custom_url:
            url += f"id/{custom_url}"
        else:
            raise Exception("get_profile data requires a 'steam_id' or 'custom_url' parameter.")
        
        response = requests.get(url)
        src = response.text

    pattern = "g_rgProfileData = ({.+?})";
    match = re.search(pattern, src)
    if match:
        # parsed from steam profile code 
        # {
            # "url": "https://steamcommunity.com/id/1sate/", 
            # "steamid": "76561199186784149", 
            # "personaname": "rasses6.fabbri299306", 
            # "summary": "No information given."
        # }
        profile_data = json.loads(match.group(1))
        return profile_data
