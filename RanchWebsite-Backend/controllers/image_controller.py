from flask import jsonify
import flask
import glob, os
import uuid
from db import db
from models.app_users import AppUsers, user_schema
from models.pic_reference import PicReferences, pic_schema
from PIL import Image
from lib.authenticate import authenticate_return_auth
import base64

@authenticate_return_auth
def pic_add(req:flask.Request, auth_info) -> flask.Response:
    post_data = req.get_json()
    file_bytes = post_data.get('pic_bytes')
    original_name = post_data.get('file_name')
    ext = post_data.get('ext')
    base_64_file_bytes = file_bytes.encode('utf-8')
    file_id = uuid.uuid4()
    user_id = auth_info.user.user_id

    path = os.getcwd() + "/endpoints/uploads/images/" + f'{file_id}.{ext}'
    thumb_path = os.getcwd() + "/endpoints/uploads/images/thumbnails/" + f'{file_id}'
    
    with open(path, 'wb') as output:
        decoded_image = base64.decodebytes(base_64_file_bytes)
        output.write(decoded_image)

    size = 90, 90

    for infile in glob.glob(path):
        file, ext = os.path.splitext(thumb_path)
        with Image.open(infile) as im:
            im.thumbnail(size)
            im.save(file + ".JPEG")


        record = PicReferences(file_id, user_id, original_name, ext)

        db.session.add(record)
        db.session.commit()
 
    return jsonify('Uploaded image.'), 200