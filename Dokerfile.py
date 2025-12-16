# 1. Base Image: Official Kali Linux
FROM kalilinux/kali-rolling

# 2. Non-interactive mode (تاکہ انسٹالیشن کے دوران سوال نہ پوچھے)
ENV DEBIAN_FRONTEND=noninteractive

# 3. Update & Install Basic Tools (Node.js سرور چلانے کے لیے چاہیے)
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    python3-pip \
    nodejs \
    npm \
    nano \
    wget \
    build-essential \
    net-tools \
    # کالی کے مشہور ٹولز (آپ اپنی مرضی سے اور بھی لکھ سکتے ہیں)
    nmap \
    sqlmap \
    && apt-get clean

# 4. Set Working Directory
WORKDIR /root/terminal-server

# 5. Copy Files
COPY package.json .
RUN npm install

COPY . .

# 6. Port & Start
ENV PORT=3000
CMD ["node", "index.js"]
