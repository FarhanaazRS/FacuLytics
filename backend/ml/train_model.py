import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os

# Load CSV
csv_path = os.path.join(os.path.dirname(__file__), "../data/faculty_reviews.csv")
df = pd.read_csv(csv_path)

# Features and labels
X = df['review_text']       # Text of reviews
y = df['rating']            # Ratings

# Convert text to numeric features
vectorizer = CountVectorizer()
X_vec = vectorizer.fit_transform(X)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_vec, y)

# Save the model and vectorizer
joblib.dump(model, os.path.join(os.path.dirname(__file__), "sentiment_model.pkl"))
joblib.dump(vectorizer, os.path.join(os.path.dirname(__file__), "vectorizer.pkl"))

print("Training complete. Model saved!")
