#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Git Push Workflow ===${NC}\n"

# Step 1: Show git status
echo -e "${YELLOW}Git Status:${NC}"
git status
echo ""

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}Current branch: ${CURRENT_BRANCH}${NC}\n"

# Check if we need to create a new branch or just commit
CREATE_NEW_BRANCH=false
if [ "$CURRENT_BRANCH" = "master" ] || [ "$CURRENT_BRANCH" = "develop" ] || [ "$CURRENT_BRANCH" = "main" ]; then
    CREATE_NEW_BRANCH=true
    echo -e "${YELLOW}⚠️  You're on ${CURRENT_BRANCH}. A new branch will be created.${NC}\n"
else
    echo -e "${GREEN}✓ Already on feature branch. Will commit and push.${NC}\n"
fi

# Get commit info
if [ "$CREATE_NEW_BRANCH" = true ]; then
    echo -e "${YELLOW}Branch type:${NC} 1)feature 2)chore 3)bugfix"
    read -p "Choose (1-3): " choice

    case $choice in
        1) BRANCH_TYPE="feature";;
        2) BRANCH_TYPE="chore";;
        3) BRANCH_TYPE="bugfix";;
        *) 
            echo -e "${RED}Invalid choice. Exiting.${NC}"
            exit 1
            ;;
    esac

    read -p "${YELLOW}Description (use-dashes):${NC} " DESCRIPTION

    if [ -z "$DESCRIPTION" ]; then
        echo -e "${RED}Description cannot be empty. Exiting.${NC}"
        exit 1
    fi

    NEW_BRANCH="${BRANCH_TYPE}/${CURRENT_BRANCH}/${DESCRIPTION}"
    COMMIT_MSG="${BRANCH_TYPE}: ${DESCRIPTION//-/ }"
    
    echo -e "\n${BLUE}New branch:${NC} ${NEW_BRANCH}"
    echo -e "${BLUE}Commit msg:${NC} ${COMMIT_MSG}\n"
else
    # Already on a feature branch, just get commit message
    read -p "${YELLOW}Commit message:${NC} " COMMIT_MSG
    
    if [ -z "$COMMIT_MSG" ]; then
        echo -e "${RED}Commit message cannot be empty. Exiting.${NC}"
        exit 1
    fi
    
    echo -e "\n${BLUE}Commit msg:${NC} ${COMMIT_MSG}\n"
fi

# Stage changes
echo -e "${YELLOW}[1/4] Staging changes...${NC}"
git add .
echo -e "${GREEN}✓ Staged${NC}\n"

# Commit
echo -e "${YELLOW}[2/4] Committing...${NC}"
git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to commit. Exiting.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Committed${NC}\n"

# Create new branch if needed
if [ "$CREATE_NEW_BRANCH" = true ]; then
    echo -e "${YELLOW}[3/4] Creating branch...${NC}"
    git checkout -b "$NEW_BRANCH"

    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to create branch. Exiting.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Branch created${NC}\n"
    
    PUSH_BRANCH="$NEW_BRANCH"
else
    echo -e "${YELLOW}[3/4] Staying on current branch${NC}"
    echo -e "${GREEN}✓ ${CURRENT_BRANCH}${NC}\n"
    PUSH_BRANCH="$CURRENT_BRANCH"
fi

# Push to remote
echo -e "${YELLOW}[4/4] Pushing to remote...${NC}"
git push -u origin "$PUSH_BRANCH"

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to push to remote${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Pushed${NC}\n"

# Open PR (optional)
echo -e "${YELLOW}Open PR in browser?${NC} (y/n)"
read -p "> " OPEN_PR

if [ "$OPEN_PR" = "y" ] || [ "$OPEN_PR" = "Y" ]; then
    REPO_URL=$(git config --get remote.origin.url | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
    open "${REPO_URL}/pull/new/${PUSH_BRANCH}"
    echo -e "${GREEN}✓ Opening PR page...${NC}\n"
fi

echo -e "${GREEN}✅ Done!${NC}"
echo -e "${BLUE}Branch: ${PUSH_BRANCH}${NC}"

