#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Build Local - OnePercent App${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "What would you like to build?"
echo ""
echo "  1) Frontend (Angular/Ionic)"
echo "  2) Backend (NestJS)"
echo "  3) Both"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    echo -e "\n${GREEN}Building Frontend...${NC}\n"
    cd onepercentapp-fe && npm run build:local
    if [ $? -eq 0 ]; then
      echo -e "\n${GREEN}✓ Frontend build completed successfully!${NC}"
    else
      echo -e "\n${YELLOW}✗ Frontend build failed!${NC}"
      exit 1
    fi
    ;;
  2)
    echo -e "\n${GREEN}Building Backend...${NC}\n"
    cd onepercentapp-be && npm run build
    if [ $? -eq 0 ]; then
      echo -e "\n${GREEN}✓ Backend build completed successfully!${NC}"
    else
      echo -e "\n${YELLOW}✗ Backend build failed!${NC}"
      exit 1
    fi
    ;;
  3)
    echo -e "\n${GREEN}Building Frontend...${NC}\n"
    cd onepercentapp-fe && npm run build:local
    if [ $? -eq 0 ]; then
      echo -e "\n${GREEN}✓ Frontend build completed successfully!${NC}"
    else
      echo -e "\n${YELLOW}✗ Frontend build failed!${NC}"
      exit 1
    fi
    
    echo -e "\n${GREEN}Building Backend...${NC}\n"
    cd ../onepercentapp-be && npm run build
    if [ $? -eq 0 ]; then
      echo -e "\n${GREEN}✓ Backend build completed successfully!${NC}"
    else
      echo -e "\n${YELLOW}✗ Backend build failed!${NC}"
      exit 1
    fi
    
    echo -e "\n${GREEN}✓ Both builds completed successfully!${NC}"
    ;;
  *)
    echo -e "\n${YELLOW}Invalid choice. Please run the command again and select 1, 2, or 3.${NC}"
    exit 1
    ;;
esac

echo ""

