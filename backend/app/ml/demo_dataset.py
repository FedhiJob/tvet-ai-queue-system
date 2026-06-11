from __future__ import annotations

# Minimal demo dataset for TF-IDF + Naive Bayes text classification.
# Each item: (text_description, category)

DEMO_DATASET: list[tuple[str, str]] = [
    # Transcript
    ("I need a transcript of my academic records", "Transcript Request"),
    ("Requesting official transcript", "Transcript Request"),
    ("Please help me obtain my transcript", "Transcript Request"),
    ("Graduation student needs transcript", "Transcript Request"),

    # ID replacement
    ("I want to replace my student ID", "ID Replacement"),
    ("Replacement of lost ID card", "ID Replacement"),
    ("My ID is missing, please issue another", "ID Replacement"),
    ("Need new student ID due to damage", "ID Replacement"),

    # Registration issue
    ("I cannot register for courses", "Registration Issue"),
    ("Registration problem, please assist", "Registration Issue"),
    ("Unable to complete registration", "Registration Issue"),
    ("Course registration error", "Registration Issue"),

    # Grade appeal
    ("I want to appeal my grade", "Grade Appeal"),
    ("Requesting review of final grades", "Grade Appeal"),
    ("My grade seems incorrect, please check", "Grade Appeal"),
    ("Appeal for improved grade", "Grade Appeal"),

    # Graduation clearance
    ("I need graduation clearance", "Graduation Clearance"),
    ("Requesting clearance for graduation", "Graduation Clearance"),
    ("Need confirmation before graduation", "Graduation Clearance"),
    ("Clearance required for graduation", "Graduation Clearance"),

    # Document verification
    ("I need verification of my documents", "Document Verification"),
    ("Please verify my certificates", "Document Verification"),
    ("Document verification request", "Document Verification"),
    ("Verify my academic documents", "Document Verification"),
]

