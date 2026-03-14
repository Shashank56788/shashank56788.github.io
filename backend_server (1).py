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
import base64
import io
from PIL import Image
import random

app = Flask(__name__)
# Enable CORS for all routes to allow dashboard to connect
CORS(app, resources={r"/api/*": {"origins": "*"}})

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

# Disease Detection Database
# In production, this would be replaced with actual CNN model predictions
disease_database = [
    {
        'name': 'Late Blight',
        'crop': 'Tomato',
        'severity': 'High',
        'confidence': 0.94,
        'description': 'Fungal disease causing dark lesions on leaves and stems',
        'symptoms': ['Dark brown spots on leaves', 'White fuzzy growth', 'Rapid spreading', 'Affects fruits'],
        'treatment': [
            'Remove and destroy infected plants immediately',
            'Apply copper-based fungicide',
            'Improve air circulation',
            'Avoid overhead watering'
        ],
        'prevention': [
            'Use disease-resistant varieties',
            'Practice crop rotation',
            'Maintain proper spacing',
            'Water at soil level'
        ]
    },
    {
        'name': 'Powdery Mildew',
        'crop': 'Grape',
        'severity': 'Medium',
        'confidence': 0.91,
        'description': 'White powdery fungal growth on leaves and fruits',
        'symptoms': ['White powdery coating', 'Leaf curling', 'Stunted growth', 'Reduced yield'],
        'treatment': [
            'Apply sulfur-based fungicide',
            'Prune affected areas',
            'Increase sunlight exposure',
            'Use neem oil spray'
        ],
        'prevention': [
            'Plant in sunny locations',
            'Ensure good air flow',
            'Avoid over-fertilizing',
            'Regular monitoring'
        ]
    },
    {
        'name': 'Bacterial Spot',
        'crop': 'Pepper',
        'severity': 'High',
        'confidence': 0.88,
        'description': 'Bacterial infection causing dark spots on leaves and fruits',
        'symptoms': ['Small dark spots with yellow halo', 'Leaf drop', 'Fruit lesions', 'Defoliation'],
        'treatment': [
            'Apply copper-based bactericide',
            'Remove infected plant parts',
            'Disinfect tools between cuts',
            'Avoid working with wet plants'
        ],
        'prevention': [
            'Use certified disease-free seeds',
            'Practice 2-3 year crop rotation',
            'Mulch to prevent soil splash',
            'Drip irrigation preferred'
        ]
    },
    {
        'name': 'Early Blight',
        'crop': 'Potato',
        'severity': 'Medium',
        'confidence': 0.89,
        'description': 'Fungal disease with concentric ring patterns on leaves',
        'symptoms': ['Target-like spots on leaves', 'Yellowing of leaves', 'Premature defoliation', 'Reduced tuber size'],
        'treatment': [
            'Apply fungicide at first sign',
            'Remove infected lower leaves',
            'Maintain plant vigor',
            'Proper fertilization'
        ],
        'prevention': [
            'Rotate crops every 2-3 years',
            'Use certified disease-free seed potatoes',
            'Avoid overhead irrigation',
            'Space plants properly'
        ]
    },
    {
        'name': 'Leaf Rust',
        'crop': 'Wheat',
        'severity': 'High',
        'confidence': 0.92,
        'description': 'Orange-brown pustules on leaves causing yield loss',
        'symptoms': ['Orange-red pustules', 'Yellow spots', 'Premature leaf death', 'Weakened stems'],
        'treatment': [
            'Apply fungicide when first detected',
            'Harvest early if severe',
            'Remove crop residue',
            'Monitor regularly'
        ],
        'prevention': [
            'Plant rust-resistant varieties',
            'Avoid planting too early',
            'Remove volunteer plants',
            'Proper field sanitation'
        ]
    },
    {
        'name': 'Anthracnose',
        'crop': 'Strawberry',
        'severity': 'Medium',
        'confidence': 0.87,
        'description': 'Fungal disease causing fruit rot and crown damage',
        'symptoms': ['Sunken lesions on fruit', 'Black spots', 'Crown rot', 'Wilting plants'],
        'treatment': [
            'Remove infected plants',
            'Apply appropriate fungicide',
            'Improve drainage',
            'Avoid plant stress'
        ],
        'prevention': [
            'Use disease-free transplants',
            'Plant in well-drained soil',
            'Avoid overhead watering',
            'Remove old leaves regularly'
        ]
    }
]

@app.route('/')
def home():
    """API information endpoint"""
    return jsonify({
        'name': 'Smart Agriculture AI API',
        'version': '2.0',
        'status': 'operational',
        'endpoints': {
            '/api/sensors': 'GET current sensor readings',
            '/api/sensors/update': 'POST new sensor data',
            '/api/irrigation': 'GET irrigation prediction',
            '/api/health': 'GET crop health status',
            '/api/yield': 'GET yield prediction',
            '/api/anomalies': 'GET anomaly detection results',
            '/api/analyze': 'GET comprehensive analysis',
            '/api/recommendations': 'GET prioritized recommendations',
            '/api/disease/detect': 'POST image for disease detection',
            '/api/disease/list': 'GET list of detectable diseases'
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

@app.route('/api/disease/detect', methods=['POST'])
def detect_disease():
    """
    Disease detection endpoint
    Accepts image in base64 format and returns disease prediction
    
    In production, this would use a CNN model (TensorFlow/PyTorch)
    For now, it returns a random disease from the database for demonstration
    """
    try:
        data = request.json
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Extract image data
        image_data = data['image']
        
        # In production, you would:
        # 1. Decode base64 image
        # 2. Preprocess image (resize, normalize)
        # 3. Run through CNN model
        # 4. Return prediction
        
        # For demonstration, we'll simulate the process
        try:
            # Decode base64 image (validation)
            if 'base64,' in image_data:
                image_data = image_data.split('base64,')[1]
            
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Simulate image preprocessing
            image_size = image.size
            print(f"Received image: {image_size[0]}x{image_size[1]} pixels")
            
        except Exception as e:
            return jsonify({'error': 'Invalid image format', 'details': str(e)}), 400
        
        # Simulate CNN prediction (random selection for demo)
        # In production: prediction = cnn_model.predict(preprocessed_image)
        detected_disease = random.choice(disease_database)
        
        # Add slight variation to confidence
        detected_disease = detected_disease.copy()
        detected_disease['confidence'] = round(detected_disease['confidence'] + random.uniform(-0.05, 0.05), 2)
        detected_disease['confidence'] = max(0.75, min(0.99, detected_disease['confidence']))
        
        return jsonify({
            'status': 'success',
            'timestamp': datetime.now().isoformat(),
            'detection': detected_disease,
            'image_info': {
                'width': image_size[0],
                'height': image_size[1],
                'format': image.format
            }
        })
        
    except Exception as e:
        return jsonify({'error': 'Detection failed', 'details': str(e)}), 500

@app.route('/api/disease/list', methods=['GET'])
def list_diseases():
    """Get list of all detectable diseases"""
    
    # Group diseases by crop type
    diseases_by_crop = {}
    for disease in disease_database:
        crop = disease['crop']
        if crop not in diseases_by_crop:
            diseases_by_crop[crop] = []
        
        diseases_by_crop[crop].append({
            'name': disease['name'],
            'severity': disease['severity'],
            'description': disease['description']
        })
    
    return jsonify({
        'total_diseases': len(disease_database),
        'diseases': disease_database,
        'by_crop': diseases_by_crop,
        'supported_crops': list(diseases_by_crop.keys())
    })

@app.route('/api/disease/info/<disease_name>', methods=['GET'])
def get_disease_info(disease_name):
    """Get detailed information about a specific disease"""
    
    # Find disease by name (case-insensitive)
    disease_name_lower = disease_name.lower().replace('-', ' ')
    
    for disease in disease_database:
        if disease['name'].lower() == disease_name_lower:
            return jsonify({
                'status': 'success',
                'disease': disease
            })
    
    return jsonify({
        'status': 'not_found',
        'error': f'Disease "{disease_name}" not found in database'
    }), 404

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("Starting Smart Agriculture AI API Server")
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
    print("\nDisease Detection Endpoints:")
    print("  - http://localhost:5000/api/disease/detect (POST)")
    print("  - http://localhost:5000/api/disease/list (GET)")
    print("  - http://localhost:5000/api/disease/info/<name> (GET)")
    print("\n" + "=" * 60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
