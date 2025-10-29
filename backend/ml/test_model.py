import joblib
import os

# Paths
base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, "sentiment_model.pkl")
vectorizer_path = os.path.join(base_dir, "vectorizer.pkl")

# Load model and vectorizer
model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

# Test example review
test_review = ["The faculty explains concepts very clearly and is approachable"]

# Transform and predict
X_test = vectorizer.transform(test_review)
prediction = model.predict(X_test)

print(f"Predicted rating: {prediction[0]}")
