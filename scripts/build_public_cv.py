"""Validate the retained public CV source before rendering it to PDF.

Edit artifacts/Nicole_Nikareayi_Public_CV.docx, render and visually inspect every
page, then copy the verified PDF to public/Nicole_Nikareayi_CV.pdf.
"""
from pathlib import Path
import re
from docx import Document
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "artifacts" / "Nicole_Nikareayi_Public_CV.docx"

def validate_source():
    text = "\n".join(p.text for p in Document(OUTPUT).paragraphs)
    if re.search(r"\+64\s*2\d(?:[\s-]*\d){7,9}", text):
        raise ValueError("Public CV must not contain a private phone number")
    for obsolete in ("100+", "30+", "464 interface states", "Implemented Google authentication", "AI Expert"):
        if obsolete in text:
            raise ValueError(f"Review unsupported or obsolete claim: {obsolete}")
    print(OUTPUT)

if __name__ == "__main__":
    validate_source()
