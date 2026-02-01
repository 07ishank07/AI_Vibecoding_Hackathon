# QR code creation

import qrcode
from io import BytesIO
import base64

def generate_qr_code(username: str) -> str:
    """Generate QR code for emergency access and return as base64 string"""
    emergency_url = f"https://crisislink.cv/emergency/{username}"
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(emergency_url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"