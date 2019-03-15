#!/bin/bash
set -e

# Build app. Set any environment specific vars here.
mira-scripts build

# Deploy to production.
mira-scripts deploy --token=$PRODUCTION_API_TOKEN --app=$PRODUCTION_APP_ID
