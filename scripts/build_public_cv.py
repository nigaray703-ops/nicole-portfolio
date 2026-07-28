from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "artifacts" / "Nicole_Nikareayi_Public_CV.docx"

NAVY = RGBColor(18, 56, 74)
TEAL = RGBColor(0, 126, 128)
MUTED = RGBColor(76, 101, 114)
INK = RGBColor(31, 43, 49)


def set_run_font(run, size, color=INK, bold=False, italic=False):
    run.font.name = "Arial"
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), "Arial")
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), "Arial")
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.bold = bold
    run.italic = italic


def set_cell_free_paragraph(paragraph, before=0, after=0, line=1.0):
    paragraph.paragraph_format.space_before = Pt(before)
    paragraph.paragraph_format.space_after = Pt(after)
    paragraph.paragraph_format.line_spacing = line


def add_hyperlink(paragraph, text, url, size=9.2):
    relationship_id = paragraph.part.relate_to(
        url,
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
        is_external=True,
    )
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), relationship_id)
    run = OxmlElement("w:r")
    properties = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), "007E80")
    properties.append(color)
    size_element = OxmlElement("w:sz")
    size_element.set(qn("w:val"), str(int(size * 2)))
    properties.append(size_element)
    size_cs = OxmlElement("w:szCs")
    size_cs.set(qn("w:val"), str(int(size * 2)))
    properties.append(size_cs)
    fonts = OxmlElement("w:rFonts")
    fonts.set(qn("w:ascii"), "Arial")
    fonts.set(qn("w:hAnsi"), "Arial")
    properties.append(fonts)
    run.append(properties)
    text_element = OxmlElement("w:t")
    text_element.text = text
    run.append(text_element)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)


def add_section_heading(document, text):
    paragraph = document.add_paragraph(style="Heading 1")
    paragraph.paragraph_format.keep_with_next = True
    paragraph.paragraph_format.space_before = Pt(8)
    paragraph.paragraph_format.space_after = Pt(3)
    run = paragraph.add_run(text.upper())
    set_run_font(run, 10.5, TEAL, bold=True)
    return paragraph


def add_role_header(document, title, organisation, dates):
    paragraph = document.add_paragraph()
    paragraph.paragraph_format.keep_with_next = True
    paragraph.paragraph_format.space_before = Pt(4)
    paragraph.paragraph_format.space_after = Pt(1)
    paragraph.paragraph_format.line_spacing = 1.0

    title_run = paragraph.add_run(title)
    set_run_font(title_run, 10, NAVY, bold=True)

    organisation_run = paragraph.add_run(f" | {organisation}")
    set_run_font(organisation_run, 9.4, INK)

    date_run = paragraph.add_run(f" | {dates}")
    set_run_font(date_run, 9.2, MUTED, italic=True)


def add_body(document, text, after=3, bold=False):
    paragraph = document.add_paragraph()
    paragraph.paragraph_format.space_before = Pt(0)
    paragraph.paragraph_format.space_after = Pt(after)
    paragraph.paragraph_format.line_spacing = 1.08
    run = paragraph.add_run(text)
    set_run_font(run, 9.2, INK, bold=bold)
    return paragraph


def add_bullet(document, text):
    paragraph = document.add_paragraph(style="List Bullet")
    paragraph.paragraph_format.left_indent = Inches(0.2)
    paragraph.paragraph_format.first_line_indent = Inches(-0.13)
    paragraph.paragraph_format.space_before = Pt(0)
    paragraph.paragraph_format.space_after = Pt(1.5)
    paragraph.paragraph_format.line_spacing = 1.04
    paragraph.paragraph_format.keep_together = True
    run = paragraph.add_run(text)
    set_run_font(run, 8.9, INK)
    return paragraph


def add_footer(section):
    paragraph = section.footer.paragraphs[0]
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    paragraph.paragraph_format.space_before = Pt(0)
    paragraph.paragraph_format.space_after = Pt(0)
    run = paragraph.add_run("Nicole Nikareayi | Public CV | ")
    set_run_font(run, 8, MUTED)

    page_field = OxmlElement("w:fldSimple")
    page_field.set(qn("w:instr"), "PAGE")
    paragraph._p.append(page_field)

    separator = paragraph.add_run(" / ")
    set_run_font(separator, 8, MUTED)

    pages_field = OxmlElement("w:fldSimple")
    pages_field.set(qn("w:instr"), "NUMPAGES")
    paragraph._p.append(pages_field)


def configure_styles(document):
    normal = document.styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.font.size = Pt(9.2)
    normal.font.color.rgb = INK
    normal.paragraph_format.space_before = Pt(0)
    normal.paragraph_format.space_after = Pt(3)
    normal.paragraph_format.line_spacing = 1.08

    heading = document.styles["Heading 1"]
    heading.font.name = "Arial"
    heading._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    heading._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    heading.font.size = Pt(10.5)
    heading.font.bold = True
    heading.font.color.rgb = TEAL
    heading.paragraph_format.space_before = Pt(8)
    heading.paragraph_format.space_after = Pt(3)
    heading.paragraph_format.keep_with_next = True

    bullet = document.styles["List Bullet"]
    bullet.font.name = "Arial"
    bullet._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    bullet._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    bullet.font.size = Pt(8.9)
    bullet.font.color.rgb = INK
    bullet.paragraph_format.left_indent = Inches(0.2)
    bullet.paragraph_format.first_line_indent = Inches(-0.13)
    bullet.paragraph_format.space_before = Pt(0)
    bullet.paragraph_format.space_after = Pt(1.5)
    bullet.paragraph_format.line_spacing = 1.04


def build_cv():
    document = Document()
    document.core_properties.title = "Nicole Nikareayi - Graduate Business Analyst CV"
    document.core_properties.author = "Nicole Nikareayi"
    document.core_properties.subject = "Public job application CV"
    document.core_properties.keywords = (
        "Business Analyst, Graduate, Digital Product, Technology Innovation"
    )

    section = document.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(0.62)
    section.bottom_margin = Inches(0.62)
    section.left_margin = Inches(0.72)
    section.right_margin = Inches(0.72)
    section.header_distance = Inches(0.3)
    section.footer_distance = Inches(0.3)
    add_footer(section)
    configure_styles(document)

    name = document.add_paragraph()
    set_cell_free_paragraph(name, after=1)
    name_run = name.add_run("Nicole Nikareayi")
    set_run_font(name_run, 24, NAVY, bold=True)

    role = document.add_paragraph()
    set_cell_free_paragraph(role, after=4)
    role_run = role.add_run(
        "GRADUATE BUSINESS ANALYST | BUSINESS SYSTEMS, DATA & IMPLEMENTATION"
    )
    set_run_font(role_run, 11, TEAL, bold=True)

    contact = document.add_paragraph()
    set_cell_free_paragraph(contact, after=1)
    location = contact.add_run("Auckland, New Zealand  |  ")
    set_run_font(location, 9.2, MUTED)
    add_hyperlink(contact, "nigaray703@gmail.com", "mailto:nigaray703@gmail.com")
    separator = contact.add_run("  |  ")
    set_run_font(separator, 9.2, MUTED)
    add_hyperlink(
        contact,
        "linkedin.com/in/nikareayi-aisikaer",
        "https://www.linkedin.com/in/nikareayi-aisikaer",
    )
    separator = contact.add_run("  |  ")
    set_run_font(separator, 9.2, MUTED)
    add_hyperlink(
        contact,
        "github.com/nigaray703-ops",
        "https://github.com/nigaray703-ops",
    )

    rights = document.add_paragraph()
    set_cell_free_paragraph(rights, after=5)
    rights_run = rights.add_run(
        "Open Post-Study Work Visa | Full New Zealand work rights until 25 March 2029"
    )
    set_run_font(rights_run, 9.2, MUTED)

    add_section_heading(document, "Professional Summary")
    add_body(
        document,
        "Master of Technology Innovation in Business graduate with Distinction and practical experience translating stakeholder needs into requirements, workflows, structured data, prototypes and functional digital products. Brings hands-on experience in platform evaluation, testing, documentation, data organisation and iterative process improvement across internship, academic and independently built projects.",
        after=4,
    )
    add_body(
        document,
        "Targeting graduate and junior opportunities across business analysis, business systems, application support, implementation coordination, functional consulting, master data, data quality, reporting and continuous improvement.",
        after=4,
    )

    add_section_heading(document, "Core Capabilities")
    add_body(
        document,
        "Business analysis: requirements gathering, stakeholder communication, process mapping, gap analysis, user stories and functional requirements. Systems and implementation: platform evaluation, workflow modelling, testing coordination, feedback triage and documentation. Data and reporting: data cleaning, validation, structured records, lookups, pivot tables and dashboard design. Improvement: issue identification, workflow optimisation and iterative refinement.",
        after=4,
    )

    add_section_heading(document, "Professional Experience")
    add_role_header(
        document,
        "Technology Innovation Intern - Business Analysis and Digital Delivery",
        "University of Waikato (STEMX500)",
        "Nov 2025 - Feb 2026 | 400+ hours",
    )
    add_bullet(
        document,
        "Translated project objectives and stakeholder needs into user journeys, interaction flows and functional requirements for an interactive cultural storytelling experience.",
    )
    add_bullet(
        document,
        "Built and refined a responsive Wix prototype across desktop and mobile, using structured platform evaluation to resolve implementation constraints.",
    )
    add_bullet(
        document,
        "Applied usability and accessibility principles, including clarity-first interaction, cognitive-load reduction and intuitive navigation.",
    )
    add_bullet(
        document,
        "Coordinated testing, feedback synthesis and iterative refinement; delivered the final prototype, documentation and presentation.",
    )

    add_section_heading(document, "Selected Digital Projects")
    add_role_header(
        document,
        "Career Command Center - Bilingual Job Application Tracker",
        "Independent project",
        "Jun 2026 - Present",
    )
    add_bullet(
        document,
        "Defined requirements, workflow stages, status categories and information architecture for managing job applications and follow-up actions.",
    )
    add_bullet(
        document,
        "Designed dashboard analytics, filtering, sorting and structured records; implemented local backup, restore and privacy-safe demo data.",
    )
    add_bullet(
        document,
        "Iteratively tested and refined the responsive interface using real-world workflow needs.",
    )

    add_role_header(
        document,
        "Cash Safety Assistant - Personal Finance Planning Web App",
        "Independent project",
        "Jun 2026 - Present",
    )
    add_bullet(
        document,
        "Defined a mobile-first cash-planning workflow covering income, recurring expenses, estimated utilities and projected balances.",
    )
    add_bullet(
        document,
        "Designed the responsive dashboard and implemented Firebase Authentication, private Firestore synchronisation and a public Demo mode.",
    )

    document.add_page_break()

    add_section_heading(document, "Selected University Projects")
    add_role_header(
        document,
        "PawPal Health - AI-enabled Dog Wellbeing Concept",
        "University of Waikato (COMPX500)",
        "Sep 2025 - Oct 2025",
    )
    add_bullet(
        document,
        "Translated pet-owner needs into feature requirements for activity tracking, symptom monitoring, wellbeing insights and AI-assisted feedback.",
    )
    add_bullet(
        document,
        "Designed a dashboard that presents behavioural and physiological information clearly and created interactive prototype screens in Proto.io.",
    )
    add_bullet(
        document,
        "Presented the product concept, user value, design rationale and innovation opportunity.",
    )

    add_role_header(
        document,
        "GlobeMate - Personalised Travel Planning Concept",
        "University of Waikato (MNMGT544)",
        "Jul 2025 - Oct 2025",
    )
    add_bullet(
        document,
        "Conducted market research and customer segmentation for a travel concept combining weather insight, budget estimation and memory mapping.",
    )
    add_bullet(
        document,
        "Shaped feature logic and the value proposition, contributing to business-case development and concept validation in a multidisciplinary team.",
    )

    add_section_heading(document, "Leadership and Community")
    add_role_header(
        document,
        "Arts Committee Chair",
        "Dalian Jiaotong University",
        "Mar 2021 - Sep 2023",
    )
    add_bullet(
        document,
        "Planned campus events with 100+ participants and coordinated cross-functional teams across departments and student groups.",
    )
    add_role_header(
        document,
        "Ethnic Minority Liaison",
        "Dalian Jiaotong University",
        "Sep 2020 - Jul 2024",
    )
    add_bullet(
        document,
        "Supported communication and coordination for 30+ students and maintained structured records.",
    )

    add_section_heading(document, "Education")
    add_role_header(
        document,
        "Master of Technology Innovation in Business - Distinction",
        "University of Waikato, New Zealand",
        "Feb 2025 - Feb 2026",
    )
    add_role_header(
        document,
        "Bachelor of Management (Accounting)",
        "Dalian Jiaotong University, China",
        "Sep 2020 - Jul 2024",
    )

    add_section_heading(document, "Tools and Technical Skills")
    add_body(
        document,
        "Business systems and data: Excel data cleaning, sorting, filtering, basic formulas, lookup functions and pivot tables; Word documentation; PowerPoint reporting and presentations. Analysis and design: Figma, Miro, Proto.io, Wix, Jira and Confluence (basic exposure). Web and data tools: HTML, CSS, JavaScript, Firebase, Firestore, GitHub, basic Python and Jupyter Notebook.",
        after=3,
    )

    add_section_heading(document, "Languages")
    add_body(
        document,
        "Uyghur - native | Mandarin Chinese - native | English - professional working proficiency | Korean - basic conversational | Te Reo Maori - introductory",
        after=0,
    )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document.save(OUTPUT)
    print(OUTPUT)


if __name__ == "__main__":
    build_cv()
