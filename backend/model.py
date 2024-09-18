import json
from math import radians, sin, cos, sqrt, atan2

# Load places data from a JSON file (or database)
with open('./backend/places.json', 'r') as f:
    places_data = json.load(f)

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of Earth in kilometers
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)*2 + cos(lat1) * cos(lat2) * sin(dlon/2)*2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c

def get_nearby_places(lat, lon, max_distance):
    nearby_places = []
    for place in places_data['places']:
        distance = calculate_distance(lat, lon, place['latitude'], place['longitude'])
        if distance <= max_distance:
            nearby_places.append({
                "name": place['name'],
                "latitude": place['latitude'],
                "longitude": place['longitude'],
                "distance": round(distance, 2)
            })
    return nearby_places

def cluster_places_by_type(places):
    # Example ML function for clustering places by type, distance, etc.
    clusters = {}
    for place in places:
        place_type = place.get('type', 'Unknown')
        if place_type not in clusters:
            clusters[place_type] = []
        clusters[place_type].append(place)
    return clusters