
# This function saves a file in s3 and generates a url if it is a poster it is saved under posters
# otherwise inside movies
import boto3
def save_to_s3(file, is_poster=True):
    if is_poster:
        print("Saving poster to s3")
    else:
        print("Saving video to s3")
        
    return "random_string"