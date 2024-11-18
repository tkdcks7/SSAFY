# fastapi 코드
from fastapi import FastAPI, File, UploadFile, Response
from typing import List
import numpy as np
from PIL import Image
import io
from layout_analyzer import get_page_layouts, save_as_npz

app = FastAPI()

# 업로드된 파일들을 PIL Image 객체로 변환
async def process_image_as_PIL_image(files: List[UploadFile]) -> List[Image.Image]:
    images = []
    for file in files:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        images.append(image)
    return images

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/layout-analysis")
async def analyze_document(files: List[UploadFile] = File(...)):
    try:
        images = await process_image_as_PIL_image(files)
        pages, layout_images = get_page_layouts(images)
        data = save_as_npz(pages, layout_images)
        
        return Response(
            content=data,
            media_type='application/octet-stream',
            headers={
                'Content-Disposition': 'attachment; filename=result.npz'
            }
        )
    except Exception as e:
        return Response(
            content={'error': str(e)},
            status_code=500
        )

