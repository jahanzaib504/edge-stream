from django.core.mail import send_mail
def send_email(email, link):
    message = f"""Please click the Link below to verify your email. 
        {link}
        
        Note: This link will expire automatically in 2 minutes
    """
    print("Sending verification email")
    send_mail(subject="Email Verification Edge-Stream", 
              message=message, 
              from_email=None, 
              recipient_list=[email], 
              fail_silently=False)
    