from __future__ import annotations

from pathlib import Path

import joblib

from app.ml.train_nb import default_artifacts_dir, normalize_text


class NBTextClassifier:
    def __init__(self):
        self._load()

    def _load(self) -> None:
        artifacts_dir = default_artifacts_dir()
        model_path = artifacts_dir / "model.pkl"
        vectorizer_path = artifacts_dir / "vectorizer.pkl"

        if not model_path.exists() or not vectorizer_path.exists():
            raise FileNotFoundError(
                f"AI artifacts not found. Expected {model_path} and {vectorizer_path}."
            )

        self.model = joblib.load(model_path)
        self.vectorizer = joblib.load(vectorizer_path)

    def predict_category_and_confidence(self, *, description: str) -> tuple[str, float]:
        text = normalize_text(description)
        x = self.vectorizer.transform([text])

        # MultinomialNB supports predict_proba when fitted.
        if hasattr(self.model, "predict_proba"):
            proba = self.model.predict_proba(x)[0]
            idx = int(proba.argmax())
            category = str(self.model.classes_[idx])
            confidence = float(proba[idx])
            return category, confidence

        # Fallback: no proba
        category = str(self.model.predict(x)[0])
        return category, 0.0

