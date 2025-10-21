# ---------- 1) Build stage ----------
# Uses Maven with JDK 21. If you’re on Java 17, switch both images to temurin-17.
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copy only files needed to resolve dependencies first (better Docker cache)
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw mvnw

# Make wrapper executable (in Linux containers)
RUN chmod +x mvnw

# Pull dependencies (cached unless pom changes)
RUN ./mvnw -q -DskipTests dependency:go-offline

# Now bring in sources and build the jar
COPY src/ src/
# If you have runtime assets under src/main/resources they'll be included automatically
RUN ./mvnw -q -DskipTests package

# ---------- 2) Runtime stage ----------
FROM eclipse-temurin:21-jre-alpine

# (Optional) Set timezone support; remove if not needed
RUN apk add --no-cache tzdata

# Run as a non-root user for better security
RUN addgroup -S app && adduser -S app -G app
USER app

WORKDIR /app

# Copy the fat jar built by Spring Boot
# The wildcard handles your actual artifact name (SNAPSHOT or not)
COPY --from=build /workspace/target/*.jar /app/app.jar

# Common runtime envs (adjust as needed)
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75" \
    SPRING_PROFILES_ACTIVE=docker \
    SERVER_PORT=8080

EXPOSE 8080

# (Optional) Healthcheck — enable Actuator /actuator/health for this to work
# HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
#   CMD wget -qO- http://localhost:8080/actuator/health | grep -q '"status":"UP"' || exit 1

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
