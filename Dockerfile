# Use the official Ubuntu image as the base image
FROM ubuntu:20.04

# Set environment variables to avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=/root

# Install curl, gnupg, unzip, build-essential, and other dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    unzip \
    lsb-release \
    build-essential \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Download and install `wait-for-it` script
RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x wait-for-it.sh \
    && mv wait-for-it.sh /usr/local/bin/wait-for-it

# Install Bun using curl
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH by updating the environment
ENV PATH="$HOME/.bun/bin:$PATH"

# Set the working directory inside the container
WORKDIR /app

# Copy package.json, package-lock.json (or yarn.lock), and bun.lockb to the container
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of the application code to the container
COPY . .
RUN rm -r drizzle/

# Expose the port that the app will run on (Elysia default is 3724)
EXPOSE 3724

# Command to run the application when the container starts
CMD ["bun", "run", "start"]
