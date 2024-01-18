FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Add some utilities
RUN apt-get update \
	&& apt-get install -y --no-install-recommends vim

# To be able to run Cypress (no studio available in `codespace`)
RUN apt-get install -y --no-install-recommends libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libnss3 libxss1 libasound2 libxtst6 xauth xvfb

# TODO: a way to alway get the latest version
RUN wget --progress=dot:giga -O /bin/hadolint https://github.com/hadolint/hadolint/releases/download/v2.12.0/hadolint-Linux-x86_64 \
	&& chmod +x /bin/hadolint

# From https://github.com/devcontainers/features/tree/main/src/desktop-lite
# TODO: after enabling the desktop feature
# RUN apt install -y firefox-esr
# RUN curl -sSL https://dl.google.com/linux/direct/google-chrome-stable_current_$(dpkg --print-architecture).deb -o /tmp/chrome.deb \
#     && apt -y install /tmp/chrome.deb && rm /tmp/chrome.deb
