from pathlib import Path
import re
import unittest

from docx import Document


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DOCX = ROOT / "artifacts" / "Nicole_Nikareayi_Public_CV.docx"


class PublicCvContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        document = Document(PUBLIC_DOCX)
        cls.text = "\n".join(paragraph.text for paragraph in document.paragraphs)

    def test_includes_current_selected_evidence(self):
        for expected in (
            "Career Command Center",
            "Ana Tilim",
            "Harry Potter Knowledge Assistant",
            "16,245 rows",
            "464 interface states",
        ):
            self.assertIn(expected, self.text)

    def test_uses_current_academic_and_internship_facts(self):
        self.assertIn("Approximately 400 hours", self.text)
        self.assertNotIn("400+ hours", self.text)
        if "PawPal Health" in self.text:
            self.assertIn("ENGME585", self.text)
            self.assertNotIn("COMPX500", self.text)
        self.assertNotIn("MNMGT544", self.text)
        self.assertNotIn("MNNGT544", self.text)

    def test_preserves_public_privacy_boundary(self):
        self.assertIn(
            "Full New Zealand work rights until 25 March 2029",
            self.text,
        )
        self.assertIsNone(
            re.search(r"\+64\s*2\d(?:[\s-]*\d){7,9}", self.text),
        )


if __name__ == "__main__":
    unittest.main()
