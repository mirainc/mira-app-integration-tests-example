#!/bin/bash
set -e

# Build app with simulator.
mira-scripts static

# Serve and test app.
yarn test:integration:headless
