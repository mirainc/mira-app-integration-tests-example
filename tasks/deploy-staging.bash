#!/bin/bash
set -e

# Build app. Set any environment specific vars here.
mira-scripts build

# Deploy to staging.
mira-scripts deploy --token=$STAGING_API_TOKEN --app=$STAGING_APP_ID --api=https://api.staging.getmira.com
