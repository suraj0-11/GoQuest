from flask import Flask, jsonify, request # type: ignore
from flask_cors import CORS # type: ignore
from model import get_nearby_places, cluster_places_by_type

app = Flask(__name__)
CORS(app)

@app.route('/api/nearby-places', methods=['GET'])
def get_nearby_places_api():
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    max_distance = float(request.args.get('distance', 5))  # default to 5 km

    nearby_places = get_nearby_places(lat, lon, max_distance)
    
    # Example clustering by type
    clustered_places = cluster_places_by_type(nearby_places)
    
    return jsonify(clustered_places)

if __name__ == '__main__':
    location_thread = threading.Thread(target=update_location, daemon=True)
    location_thread.start()
    app.run(debug=True, use_reloader=False)
