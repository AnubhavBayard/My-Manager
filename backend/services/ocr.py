from paddleocr import PaddleOCR

ocr = PaddleOCR(
    use_angle_cls=True,
    lang="en"
)

def extract_text_from_image(image_path):

    result = ocr.ocr(
        image_path,
        cls=True
    )

    text = ""

    for line in result[0]:
        text += line[1][0] + "\n"

    return text