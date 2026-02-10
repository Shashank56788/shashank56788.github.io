"""
Smart Agriculture Backend Server
=================================
Flask REST API server for AI model predictions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from smart_agriculture_ai_models import SmartAgricultureSystem
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize AI system
print("Initializing Smart Agriculture AI System...")
ai_system = SmartAgricultureSystem()
print("System ready!\n")

# Simulated sensor data (in production, this would come from actual IoT sensors)
current_sensor_data = {
    'moisture': 45.0,
    'temperature': 25.0,
    'humidity': 65.0,
    'light': 600.0,
    'avg_moisture': 42.0,
    'avg_temperature': 26.5,
    'avg_humidity': 65.0,
    'avg_light': 600,
    'rainfall_total': 450,
    'growing_days': 65
}

@app.route('/')
def home():
    """API information endpoint"""
    return jsonify({
        'name': 'Smart Agriculture AI API',
        'version': '1.0',
        'status': 'operational',
        'endpoints': {
            '/api/sensors': 'GET current sensor readings',
            '/api/sensors/update': 'POST new sensor data',
            '/api/irrigation': 'GET irrigation prediction',
            '/api/health': 'GET crop health status',
            '/api/yield': 'GET yield prediction',
            '/api/anomalies': 'GET anomaly detection results',
            '/api/analyze': 'GET comprehensive analysis',
            '/api/recommendations': 'GET prioritized recommendations'
        }
    })

@app.route('/api/sensors', methods=['GET'])
def get_sensors():
    """Get current sensor readings"""
    return jsonify({
        'timestamp': datetime.now().isoformat(),
        'data': current_sensor_data
    })

@app.route('/api/sensors/update', methods=['POST'])
def update_sensors():
    """Update sensor readings (simulates IoT data input)"""
    global current_sensor_data
    
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Update only provided fields
    for key in ['moisture', 'temperature', 'humidity', 'light']:
        if key in data:
            current_sensor_data[key] = float(data[key])
    
    return jsonify({
        'status': 'success',
        'updated_data': current_sensor_data
    })

@app.route('/api/irrigation', methods=['GET'])
def get_irrigation():
    """Get irrigation prediction"""
    prediction = ai_system.irrigation_model.predict(
        current_sensor_data['moisture'],
        current_sensor_data['temperature'],
        current_sensor_data['humidity']
    )
    
    return jsonify({
        'timestamp': datetime.now().isoformat(),
        'prediction': prediction
    })

@app.route('/api/health', methods=['GET'])
def get_health():
    """Get crop health classification"""
    health = ai_system.health_model.predict(
        current_sensor_data['moisture'],
        current_sensor_data['temperature'],
        current_sensor_data['humidity'],
        current_sensor_data['light']
    )
    
    return jsonify({
        'timestamp': datetime.now().isoformat(),
        'health': health
    })

@app.route('/api/yield', methods=['GET'])
def get_yield():
    """Get yield prediction"""
    yield_pred = ai_system.yield_model.predict(
        current_sensor_data.get('avg_moisture', current_sensor_data['moisture']),
        current_sensor_data.get('avg_temperature', current_sensor_data['temperature']),
        current_sensor_data.get('avg_humidity', current_sensor_data['humidity']),
        current_sensor_data.get('avg_light', current_sensor_data['light']),
        current_sensor_data.get('rainfall_total', 500),
        current_sensor_data.get('growing_days', 45)
    )
    
    return jsonify({
        'timestamp': datetime.now().isoformat(),
        'prediction': yield_pred
    })

@app.route('/api/anomalies', methods=['GET'])
def get_anomalies():
    """Get anomaly detection results"""
    anomalies = ai_system.anomaly_detector.detect_anomalies(
        current_sensor_data['moisture'],
        current_sensor_data['temperature'],
        current_sensor_data['humidity'],
        current_sensor_data['light']
    )
    
    return jsonify({
        'timestamp': datetime.now().isoformat(),
        'anomalies': anomalies,
        'count': len(anomalies)
    })

@app.route('/api/analyze', methods=['GET', 'POST'])
def analyze():
    """Get comprehensive analysis"""
    
    # Allow custom data via POST
    if request.method == 'POST':
        custom_data = request.json
        if custom_data:
            analysis_data = {**current_sensor_data, **custom_data}
        else:
            analysis_data = current_sensor_data
    else:
        analysis_data = current_sensor_data
    
    results = ai_system.analyze(analysis_data)
    
    return jsonify(results)

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    """Get prioritized recommendations"""
    results = ai_system.analyze(current_sensor_data)
    
    return jsonify({
        'timestamp': datetime.now().isoformat(),
        'recommendations': results['recommendations']
    })

@app.route('/api/simulate', methods=['POST'])
def simulate():
    """Simulate sensor readings for testing"""
    global current_sensor_data
    
    # Generate random realistic sensor data
    current_sensor_data.update({
        'moisture': float(np.random.uniform(30, 60)),
        'temperature': float(np.random.uniform(20, 32)),
        'humidity': float(np.random.uniform(40, 80)),
        'light': float(np.random.uniform(300, 800))
    })
    
    # Run analysis
    results = ai_system.analyze(current_sensor_data)
    
    return jsonify({
        'status': 'simulation_complete',
        'new_sensor_data': current_sensor_data,
        'analysis': results
    })

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("Starting Smart Agriculture API Server")
    print("=" * 60)
    print("\nAPI Endpoints:")
    print("  - http://localhost:5000/")
    print("  - http://localhost:5000/api/sensors")
    print("  - http://localhost:5000/api/irrigation")
    print("  - http://localhost:5000/api/health")
    print("  - http://localhost:5000/api/yield")
    print("  - http://localhost:5000/api/anomalies")
    print("  - http://localhost:5000/api/analyze")
    print("  - http://localhost:5000/api/recommendations")
    print("  - http://localhost:5000/api/simulate (POST)")
    print("\n" + "=" * 60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
