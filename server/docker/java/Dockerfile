FROM amazoncorretto

WORKDIR /public/files

COPY . .

CMD ["sh", "-c", "javac $CODE_FILE && java ${CODE_FILE%.*}"]