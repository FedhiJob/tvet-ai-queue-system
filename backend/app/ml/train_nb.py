from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import joblib
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB

from app.ml.demo_dataset import DEMO_DATASET


@dataclass(frozen=True)
class TrainArtifacts:
    model_path: Path
    vectorizer_path: Path


def normalize_text(text: str) -> str:
    text = text.lower()
    # remove punctuation (keep spaces)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def train_and_persist(
    *,
    artifacts: TrainArtifacts,
    test_size: float = 0.25,
    random_state: int = 42,
) -> dict:
    texts = [normalize_text(t) for t, _ in DEMO_DATASET]
    labels = [c for _, c in DEMO_DATASET]

    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=test_size, random_state=random_state, stratify=labels
    )

    vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    clf = MultinomialNB()
    clf.fit(X_train_vec, y_train)

    y_pred = clf.predict(X_test_vec)

    acc = float(accuracy_score(y_test, y_pred))
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_test, y_pred, average="weighted", zero_division=0
    )

    # Persist
    artifacts.model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(clf, artifacts.model_path)
    joblib.dump(vectorizer, artifacts.vectorizer_path)

    return {
        "accuracy": acc,
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1),
        "num_samples": len(texts),
        "num_classes": len(set(labels)),
    }


def default_artifacts_dir() -> Path:
    # Store under backend/app/ml/artifacts for repo visibility.
    return Path(__file__).resolve().parent / "artifacts"


def train_if_missing() -> dict:
    artifacts_dir = default_artifacts_dir()
    artifacts = TrainArtifacts(
        model_path=artifacts_dir / "model.pkl",
        vectorizer_path=artifacts_dir / "vectorizer.pkl",
    )

    if artifacts.model_path.exists() and artifacts.vectorizer_path.exists():
        return {"trained": False, "reason": "artifacts already exist"}

    return {"trained": True, **train_and_persist(artifacts=artifacts)}

