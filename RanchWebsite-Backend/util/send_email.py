from sendgrid import SendGridAPIClient
import os
from sendgrid.helpers.mail import Mail, Email, To, Content

SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
SENDGRID_FROM_EMAIL = os.getenv('SENDGRID_FROM_EMAIL')

def send_email(to_email, subject, content):
    if not SENDGRID_API_KEY and not SENDGRID_FROM_EMAIL:
        return 'Exception Occured: Cannot send email without .env variables'
    sg = SendGridAPIClient(api_key=SENDGRID_API_KEY)
    message = Mail(
        from_email=SENDGRID_FROM_EMAIL,
        to_emails=to_email,
        subject=subject,
        html_content=content
    )

    response = sg.send(message)

