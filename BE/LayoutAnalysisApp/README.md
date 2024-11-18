# 레이아웃 분석하는 서버
- FastAPI로 구축
- SSAFY에서 제공하는 GPU 서버에서 작동함
- 실제 실행시 [DocLayout-YOLO](https://github.com/opendatalab/DocLayout-YOLO) 리포지토리를 클론해야 함
    - 가상환경 설정
        ```bash
        python -m venv venv
        source ./venv/Scripts/activate
        ```
    - 주의: 콘솔창에서 LayoutAnalysisApp폴더 안에 접근한 후 다음 명령어 실행
    - 방법
        ```bash
        git clone https://github.com/opendatalab/DocLayout-YOLO.git
        cd DocLayout-YOLO
        pip install -e .
        pip install --upgrade huggingface_hub
        ```
- 이 외 필요한 패키지
    ```bash
    pip install fastapi uvicorn 
    ```
- 5000번 포트에서 서버 구동
    ```bash
    uvicorn main:app --reload --port=5000
    ```