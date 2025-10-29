import sys
import joblib
import os

# Load vectorizer and model
vectorizer = joblib.load(os.path.join(os.path.dirname(__file__), "vectorizer.pkl"))
model = joblib.load(os.path.join(os.path.dirname(__file__), "sentiment_model.pkl"))

# Get review text from command line argument
review_text = sys.argv[1] if len(sys.argv) > 1 else ""

if not review_text:
    print("No review text provided")
    sys.exit(1)

# Transform and predict
X_vec = vectorizer.transform([review_text])
predicted_rating = model.predict(X_vec)[0]

print(predicted_rating)
