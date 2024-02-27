FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Add some utilities
# `bash-completion` some tools (e.g. git) can use this
RUN apt-get update && \
    apt-get install -y vim bash-completion

# To be able to run Cypress (no studio available in `codespace`)
# RUN apt-get install -y --no-install-recommends libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libnss3 libxss1 libasound2 libxtst6 xauth xvfb

# From https://github.com/devcontainers/features/tree/main/src/desktop-lite
# TODO: after enabling the desktop feature
# RUN apt install -y firefox-esr
# RUN curl -sSL https://dl.google.com/linux/direct/google-chrome-stable_current_$(dpkg --print-architecture).deb -o /tmp/chrome.deb \
#     && apt -y install /tmp/chrome.deb && rm /tmp/chrome.deb
