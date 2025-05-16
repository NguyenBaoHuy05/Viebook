from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from transformers import pipeline
from translate import Translator
import shutil
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load models
caption_pipe = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")
title_pipe = pipeline("text2text-generation", model="google/flan-t5-base")
translator = Translator(to_lang="vi")

@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    # lưu file tạm thời
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        caption_result = caption_pipe(temp_path)
        caption = caption_result[0]['generated_text']
        prompt = (
            f"Write a short, catchy, and friendly social media post title "
            f"for this image caption: '{caption}'. The title should sound natural and engaging."
        )
        title_result = title_pipe(prompt, max_new_tokens=20)
        suggested_title = title_result[0]['generated_text']

        # dịch qua tiếng Việt
        translation = translator.translate(suggested_title)
        return JSONResponse({
            "vietnamese_title": translation
        })
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)