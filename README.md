# 🌾 Smart Agriculture AI System

A comprehensive AI-powered agricultural monitoring and decision support system with real-time data visualization and predictive analytics.

## 📋 Overview

This system combines four advanced AI models to provide intelligent farming insights:

1. **Irrigation Prediction Model** - Regression-based ML model for optimal water management
2. **Crop Health Classification Model** - Multi-class classifier for plant stress detection
3. **Yield Prediction Model** - Time-series forecasting for harvest planning
4. **Anomaly Detection Model** - Real-time monitoring for abnormal conditions

## ✨ Features

### AI Models

- **Irrigation Prediction**: Predicts optimal irrigation requirements (0-100 L/m²) based on:
  - Soil moisture levels
  - Temperature
  - Humidity
  - Historical rainfall patterns

- **Crop Health Classification**: Categorizes crops into three health states:
  - ✅ Healthy
  - ⚠️ Moderate Stress
  - 🚨 High Stress

- **Yield Prediction**: Forecasts crop yield and optimal harvest timing using:
  - Seasonal sensor data
  - Growing degree days
  - Environmental conditions

- **Anomaly Detection**: Identifies abnormal conditions such as:
  - Sudden moisture loss
  - Extreme temperature variations
  - Humidity extremes
  - Low light conditions
  - Statistical outliers

### Real-time Dashboard

- **Beautiful, responsive web interface** with gradient design
- **Live sensor monitoring** with auto-refresh
- **Interactive charts** using Plotly.js
- **Color-coded alerts** for urgent conditions
- **Historical trend analysis** (24-hour view)
- **Actionable recommendations** with priority levels

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- pip (Python package manager)

### Installation

1. **Install Python dependencies:**

```bash
pip install -r requirements.txt
```

2. **Run the AI models (standalone):**

```bash
python smart_agriculture_ai_models.py
```

This will:
- Train all AI models
- Run a sample analysis
- Display comprehensive results

### Running the Full System

#### Option 1: Standalone Dashboard (Client-side only)

Simply open the HTML file in your browser:

```bash
# On macOS
open smart_agriculture_dashboard.html

# On Linux
xdg-open smart_agriculture_dashboard.html

# On Windows
start smart_agriculture_dashboard.html
```

The dashboard includes simulated AI models in JavaScript for demonstration purposes.

#### Option 2: Backend + Dashboard (Production-ready)

1. **Start the Flask backend server:**

```bash
python backend_server.py
```

The server will start at `http://localhost:5000`

2. **Access the API:**

- Main endpoint: http://localhost:5000/
- Current sensors: http://localhost:5000/api/sensors
- Irrigation prediction: http://localhost:5000/api/irrigation
- Crop health: http://localhost:5000/api/health
- Yield prediction: http://localhost:5000/api/yield
- Anomaly detection: http://localhost:5000/api/anomalies
- Full analysis: http://localhost:5000/api/analyze
- Recommendations: http://localhost:5000/api/recommendations

3. **Update sensor data (POST request):**

```bash
curl -X POST http://localhost:5000/api/sensors/update \
  -H "Content-Type: application/json" \
  -d '{
    "moisture": 35.5,
    "temperature": 28.3,
    "humidity": 62.0,
    "light": 650
  }'
```

4. **Simulate random sensor readings:**

```bash
curl -X POST http://localhost:5000/api/simulate
```

## 📊 API Documentation

### GET /api/sensors
Returns current sensor readings.

**Response:**
```json
{
  "timestamp": "2024-02-10T14:30:00",
  "data": {
    "moisture": 45.0,
    "temperature": 25.0,
    "humidity": 65.0,
    "light": 600.0
  }
}
```

### POST /api/sensors/update
Updates sensor data.

**Request:**
```json
{
  "moisture": 40.0,
  "temperature": 26.5,
  "humidity": 70.0,
  "light": 550.0
}
```

### GET /api/analyze
Returns comprehensive analysis from all AI models.

**Response:**
```json
{
  "timestamp": "2024-02-10T14:30:00",
  "irrigation": {
    "irrigation_liters_per_sqm": 45.2,
    "urgency": "moderate",
    "recommendation": "Schedule irrigation within 6-12 hours",
    "confidence": 0.89
  },
  "crop_health": {
    "health_status": "Healthy",
    "confidence": 0.92,
    "probabilities": {
      "healthy": 0.92,
      "moderate_stress": 0.06,
      "high_stress": 0.02
    },
    "recommendations": [...]
  },
  "yield_prediction": {
    "predicted_yield_kg_per_ha": 5450,
    "optimal_harvest_date": "2024-04-15",
    "days_to_harvest": 25,
    "confidence": 0.87
  },
  "anomalies": [...],
  "recommendations": [...]
}
```

## 🎨 Dashboard Features

### Real-time Monitoring Cards

1. **Live Sensor Data**
   - Soil Moisture (%)
   - Temperature (°C)
   - Humidity (%)
   - Light Intensity (lux)
   - Auto-updates every 5 seconds

2. **Irrigation Prediction**
   - Required water amount (L/m²)
   - Progress bar visualization
   - Urgency indicator
   - Actionable recommendations

3. **Crop Health Status**
   - Visual health indicator with pulse animation
   - Health factor breakdown
   - Multi-class probability chart
   - Specific health recommendations

4. **Yield Prediction**
   - Estimated yield (kg/ha)
   - Optimal harvest date
   - Growth curve visualization
   - Confidence metrics

5. **Anomaly Detection**
   - Real-time anomaly list
   - Severity classification (Critical/Warning/Info)
   - Timestamp tracking
   - Recommended actions

6. **Active Alerts**
   - Color-coded alert boxes
   - Critical vs warning distinction
   - Immediate action items

7. **Historical Trends**
   - 24-hour data visualization
   - Multi-parameter comparison
   - Dual y-axis for different units
   - Interactive Plotly charts

## 🔧 Technical Details

### AI Model Architecture

**Irrigation Prediction:**
- Algorithm: Ridge Regression
- Features: 4 (moisture, temperature, humidity, rainfall)
- Output: Continuous (0-100 L/m²)
- Training data: 1000 samples

**Crop Health Classification:**
- Algorithm: Random Forest Classifier
- Features: 4 (moisture, temperature, humidity, light)
- Classes: 3 (Healthy, Moderate Stress, High Stress)
- Estimators: 100 trees
- Training accuracy: ~95%

**Yield Prediction:**
- Algorithm: Random Forest Regressor
- Features: 6 (avg conditions + growing days)
- Output: Yield in kg/ha + optimal harvest date
- Estimators: 100 trees
- Training score: ~0.85

**Anomaly Detection:**
- Algorithm: Rule-based + Statistical (Z-score)
- Methods: 
  - Threshold-based rules
  - Time-series comparison
  - 3-sigma statistical outliers
- Real-time processing

### Technology Stack

**Backend:**
- Python 3.8+
- scikit-learn (ML models)
- NumPy (numerical computing)
- Pandas (data manipulation)
- Flask (REST API)
- Flask-CORS (cross-origin requests)

**Frontend:**
- HTML5 / CSS3
- Vanilla JavaScript (ES6+)
- Plotly.js (interactive charts)
- Responsive design (mobile-friendly)

## 📈 Sample Output

```
IRRIGATION PREDICTION:
──────────────────────────────────────────────────────────
  Required: 45.2 L/m²
  Urgency: MODERATE
  Recommendation: ⚡ Schedule irrigation within 6-12 hours
  Confidence: 89.45%

CROP HEALTH STATUS:
──────────────────────────────────────────────────────────
  Status: Healthy
  Confidence: 92.34%
  Probabilities:
    - healthy: 92.34%
    - moderate_stress: 6.12%
    - high_stress: 1.54%
  Recommendations:
    • Maintain current management practices

YIELD PREDICTION:
──────────────────────────────────────────────────────────
  Predicted Yield: 5,450 kg/ha
  Current Estimate: 4,850 kg/ha
  Optimal Harvest: 2024-04-15
  Days to Harvest: 25
  Confidence: 87.23%

ANOMALY DETECTION:
──────────────────────────────────────────────────────────
  No anomalies detected - all systems normal
```

## 🛠️ Customization

### Adjusting Model Parameters

Edit `smart_agriculture_ai_models.py`:

```python
# Change irrigation thresholds
irrigation_model = Ridge(alpha=1.0)  # Regularization strength

# Modify crop health classes
class_names = ['High Stress', 'Moderate Stress', 'Healthy']

# Adjust anomaly thresholds
thresholds = {
    'moisture_sudden_drop': 15,  # % drop
    'temperature_extreme': 38,    # °C
    'humidity_high': 90,          # %
}
```

### Customizing Dashboard Appearance

Edit the `<style>` section in `smart_agriculture_dashboard.html`:

```css
/* Change color scheme */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Modify card hover effects */
.card:hover {
    transform: translateY(-5px);
}

/* Adjust update frequency */
setInterval(updateDashboard, 5000); // 5000ms = 5 seconds
```

## 🔮 Future Enhancements

- [ ] Integration with actual IoT sensors (Arduino, Raspberry Pi)
- [ ] Mobile app (React Native)
- [ ] Historical data storage (SQLite/PostgreSQL)
- [ ] Weather API integration
- [ ] Disease detection using computer vision
- [ ] Multi-field management
- [ ] SMS/Email alert notifications
- [ ] User authentication and multi-user support
- [ ] Export reports (PDF/Excel)
- [ ] Deep learning models for advanced predictions

## 📄 License

This project is provided as-is for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Real sensor integration
- Model optimization
- Additional crop types
- UI/UX enhancements
- Documentation

## 📧 Support

For questions or issues, please refer to the code comments or create an issue in the repository.

---

**Built with ❤️ for sustainable agriculture**
