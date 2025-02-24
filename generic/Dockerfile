FROM maven:3.8.4-jdk-8 AS build
COPY src /app/src
COPY pom.xml /app
WORKDIR /app
RUN mvn clean install

FROM openjdk:8-jre-alpine
RUN apk add --no-cache bash coreutils findutils util-linux grep
COPY --from=build /app/target/*.jar /app/app.jar
WORKDIR /app
EXPOSE 8092
CMD ["java", "-jar", "app.jar"]