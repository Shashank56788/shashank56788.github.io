from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import cv2

# import your model
import smart_agriculture_ai_models as model

app = Flask(__name__)
CORS(app)

# ================================
# HELPER FUNCTION (convert image)
# ================================
def decode_image(base64_string):
    try:
        header, encoded = base64_string.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print("Error decoding image:", e)
        return None


# ================================
# MAIN API
# ================================
@app.route('/api/disease/detect', methods=['POST'])
def detect_disease():
    try:
        data = request.get_json()
        image_data = data.get("image")

        if not image_data:
            return jsonify({"status": "error", "error": "No image provided"}), 400

        # Decode image
        img = decode_image(image_data)

        if img is None:
            return jsonify({"status": "error", "error": "Invalid image"}), 400

        # ============================
        # 👉 CALL YOUR MODEL HERE
        # ============================

        # Replace this with your real function
        # Example:
        # prediction = model.predict_disease(img)

        # TEMP (dummy result)
        prediction = {
            "name": "Leaf Blight",
            "confidence": 0.93,
            "severity": "High",
            "crop": "Tomato",
            "description": "Fungal infection causing leaf damage.",
            "symptoms": ["Brown spots", "Leaf drying"],
            "treatment": ["Use fungicide", "Remove infected leaves"],
            "prevention": ["Avoid overwatering", "Improve airflow"]
        }

        return jsonify({
            "status": "success",
            "detection": prediction
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"status": "error", "error": str(e)}), 500


# ================================
# RUN SERVER
# ================================
if __name__ == "__main__":
    app.run(debug=True)