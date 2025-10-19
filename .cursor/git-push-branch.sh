#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Git Push Workflow ===${NC}\n"

# Step 1: Show git status
echo -e "${YELLOW}Step 1: Git Status${NC}"
git status
echo ""

# Step 2: Add all changes
echo -e "${YELLOW}Step 2: Adding all changes${NC}"
git add .
echo -e "${GREEN}✓ Changes staged${NC}\n"

# Step 3: Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}Current branch: ${CURRENT_BRANCH}${NC}\n"

# Step 4: Choose branch type
echo -e "${YELLOW}Step 3: Choose branch type${NC}"
echo "1) feature"
echo "2) chore"
echo "3) bugfix"
read -p "Enter choice (1-3): " choice

case $choice in
    1) BRANCH_TYPE="feature";;
    2) BRANCH_TYPE="chore";;
    3) BRANCH_TYPE="bugfix";;
    *) 
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}✓ Selected: ${BRANCH_TYPE}${NC}\n"

# Step 5: Get mini description
echo -e "${YELLOW}Step 4: Enter mini description${NC}"
read -p "Description (use-dashes-for-spaces): " DESCRIPTION

if [ -z "$DESCRIPTION" ]; then
    echo -e "${RED}Description cannot be empty. Exiting.${NC}"
    exit 1
fi

# Create new branch name
NEW_BRANCH="${BRANCH_TYPE}/${CURRENT_BRANCH}/${DESCRIPTION}"

echo -e "\n${BLUE}New branch: ${NEW_BRANCH}${NC}\n"

# Step 6: Create and checkout new branch
echo -e "${YELLOW}Step 5: Creating and checking out new branch${NC}"
git checkout -b "$NEW_BRANCH"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create branch. Exiting.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Branch created and checked out${NC}\n"

# Step 7: Push to remote
echo -e "${YELLOW}Step 6: Pushing to remote${NC}"
git push -u origin "$NEW_BRANCH"

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ Successfully pushed to remote!${NC}"
    echo -e "${BLUE}Branch: ${NEW_BRANCH}${NC}"
else
    echo -e "\n${RED}✗ Failed to push to remote${NC}"
    exit 1
fi

