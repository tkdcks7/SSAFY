# 1. 실제 애플리케이션을 실행할 기본 이미지 설정
FROM openjdk:21-jdk-slim

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 빌드된 JAR 파일을 컨테이너로 복사
ARG JAR_FILE_PATH=./build/libs/audisay-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE_PATH} deploy.jar

# 4. 애플리케이션을 실행하는 명령어 설정
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod" ,"/app/deploy.jar"]

# 5. 컨테이너가 사용할 포트 설정
#EXPOSE ///

