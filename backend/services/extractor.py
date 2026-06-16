import os
import fitz
from docx import Document

from pdf2image import convert_from_path
from services.ocr import extract_text_from_image

POPPLER_PATH = r"E:\poppler-26.02.0\Library\bin"


def extract_txt(file_path):

    with open(
        file_path,
        "r",
        encoding="utf-8",
        errors="ignore"
    ) as f:
        return f.read()


def extract_docx(file_path):

    doc = Document(file_path)

    paragraphs = []

    for para in doc.paragraphs:
        paragraphs.append(para.text)
        
    print(paragraphs)

    return "\n".join(paragraphs)


def extract_pdf(file_path):

    doc = fitz.open(file_path)

    text = ""

    for page in doc:

        text += page.get_text()

    doc.close()

    if text.strip():

        print(
            f"Extracted PDF text normally "
            f"({len(text)} chars)"
        )

        return text

    print(
        f"No text layer found in "
        f"{os.path.basename(file_path)}"
    )

    print(
        "Falling back to PaddleOCR..."
    )

    return extract_pdf_with_ocr(
        file_path
    )
    
def extract_pdf_with_ocr(file_path):

    pages = convert_from_path(
        file_path,
        poppler_path=POPPLER_PATH
    )

    full_text = ""

    image_folder = os.path.join(
        "uploads",
        "ocr_pages"
    )

    os.makedirs(
        image_folder,
        exist_ok=True
    )

    pdf_name = os.path.splitext(
        os.path.basename(file_path)
    )[0]

    for i, page in enumerate(pages):

        image_path = os.path.join(
            image_folder,
            f"{pdf_name}_page_{i+1}.png"
        )

        page.save(
            image_path,
            "PNG"
        )

        print(
            f"OCR Processing Page {i+1}"
        )

        page_text = extract_text_from_image(
            image_path
        )

        full_text += page_text + "\n"
        
        os.remove(image_path)

    return full_text


def extract_text(file_path):

    extension = os.path.splitext(
        file_path
    )[1].lower()

    if extension == ".txt":
        return extract_txt(file_path)

    elif extension == ".pdf":
        return extract_pdf(file_path)

    elif extension == ".docx":
        return extract_docx(file_path)

    elif extension in [
        ".png",
        ".jpg",
        ".jpeg",
        ".webp"
    ]:

        print(
            f"Running OCR on image: "
            f"{os.path.basename(file_path)}"
        )

        return extract_text_from_image(
            file_path
        )

    else:

        raise ValueError(
            f"Unsupported file type: {extension}"
        )