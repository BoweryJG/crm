#!/bin/bash

# Script to apply app mode and feature tier migrations to the database
# This script applies both the schema migration and the data migration

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting app mode and feature tier migration process...${NC}"

# Check if SUPABASE_URL and SUPABASE_KEY are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
  echo -e "${YELLOW}SUPABASE_URL or SUPABASE_SERVICE_KEY not found in environment.${NC}"
  echo -e "${YELLOW}Checking .env.local file...${NC}"
  
  if [ -f .env.local ]; then
    echo -e "${GREEN}Found .env.local file. Loading environment variables...${NC}"
    export $(grep -v '^#' .env.local | xargs)
  else
    echo -e "${RED}Error: .env.local file not found.${NC}"
    echo -e "${RED}Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.${NC}"
    exit 1
  fi
fi

# Check again if variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
  echo -e "${RED}Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found.${NC}"
  echo -e "${RED}Please set these environment variables and try again.${NC}"
  exit 1
fi

echo -e "${GREEN}Supabase credentials found.${NC}"

# Apply schema migration
echo -e "${YELLOW}Applying schema migration...${NC}"
SCHEMA_MIGRATION_FILE="supabase/migrations/20250525_app_mode_feature_tier.sql"

if [ ! -f "$SCHEMA_MIGRATION_FILE" ]; then
  echo -e "${RED}Error: Schema migration file not found at $SCHEMA_MIGRATION_FILE${NC}"
  exit 1
fi

# Use PSQL to apply the schema migration
PGPASSWORD=$SUPABASE_DB_PASSWORD psql -h $SUPABASE_DB_HOST -p $SUPABASE_DB_PORT -d $SUPABASE_DB_NAME -U $SUPABASE_DB_USER -f $SCHEMA_MIGRATION_FILE

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to apply schema migration.${NC}"
  exit 1
fi

echo -e "${GREEN}Schema migration applied successfully.${NC}"

# Apply data migration
echo -e "${YELLOW}Applying data migration...${NC}"
DATA_MIGRATION_FILE="supabase/migrations/20250525_initial_app_settings_data.sql"

if [ ! -f "$DATA_MIGRATION_FILE" ]; then
  echo -e "${RED}Error: Data migration file not found at $DATA_MIGRATION_FILE${NC}"
  exit 1
fi

# Use PSQL to apply the data migration
PGPASSWORD=$SUPABASE_DB_PASSWORD psql -h $SUPABASE_DB_HOST -p $SUPABASE_DB_PORT -d $SUPABASE_DB_NAME -U $SUPABASE_DB_USER -f $DATA_MIGRATION_FILE

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to apply data migration.${NC}"
  exit 1
fi

echo -e "${GREEN}Data migration applied successfully.${NC}"

# Verify the migrations
echo -e "${YELLOW}Verifying migrations...${NC}"

# Check if app_settings table exists and has data
APP_SETTINGS_COUNT=$(PGPASSWORD=$SUPABASE_DB_PASSWORD psql -h $SUPABASE_DB_HOST -p $SUPABASE_DB_PORT -d $SUPABASE_DB_NAME -U $SUPABASE_DB_USER -t -c "SELECT COUNT(*) FROM app_settings;")

if [ $? -ne 0 ] || [ -z "$APP_SETTINGS_COUNT" ]; then
  echo -e "${RED}Error: Failed to verify app_settings table.${NC}"
  exit 1
fi

# Check if user_subscriptions table exists and has data
USER_SUBSCRIPTIONS_COUNT=$(PGPASSWORD=$SUPABASE_DB_PASSWORD psql -h $SUPABASE_DB_HOST -p $SUPABASE_DB_PORT -d $SUPABASE_DB_NAME -U $SUPABASE_DB_USER -t -c "SELECT COUNT(*) FROM user_subscriptions;")

if [ $? -ne 0 ] || [ -z "$USER_SUBSCRIPTIONS_COUNT" ]; then
  echo -e "${RED}Error: Failed to verify user_subscriptions table.${NC}"
  exit 1
fi

echo -e "${GREEN}Migrations verified successfully.${NC}"
echo -e "${GREEN}app_settings table has $APP_SETTINGS_COUNT records.${NC}"
echo -e "${GREEN}user_subscriptions table has $USER_SUBSCRIPTIONS_COUNT records.${NC}"

echo -e "${GREEN}App mode and feature tier migration process completed successfully!${NC}"
