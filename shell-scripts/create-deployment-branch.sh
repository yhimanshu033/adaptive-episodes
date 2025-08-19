#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

# Check if git is available
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed or not in PATH${NC}"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Function to check for GitHub CLI
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        echo -e "${YELLOW}Warning: GitHub CLI (gh) is not installed. Will not be able to create PR automatically.${NC}"
        echo -e "${YELLOW}You can install it from: https://cli.github.com/${NC}"
        return 1
    fi
    return 0
}

# Ensure we have the latest staging
echo -e "${BLUE}Fetching latest changes from remote...${NC}"
git fetch origin

# Verify staging branch exists
if ! git show-ref --verify --quiet refs/remotes/origin/staging; then
    echo -e "${RED}Error: 'staging' branch doesn't exist on the remote${NC}"
    exit 1
fi

# Verify main branch exists
if ! git show-ref --verify --quiet refs/remotes/origin/main; then
    echo -e "${RED}Error: 'main' branch doesn't exist on the remote${NC}"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found${NC}"
    exit 1
fi

# Get current version from package.json
current_version=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
if [ -z "$current_version" ]; then
    echo -e "${RED}Error: Could not find version in package.json${NC}"
    exit 1
fi

echo -e "${BLUE}Current version: ${GREEN}$current_version${NC}"

# Parse current version
IFS='.' read -r major minor patch <<< "$current_version"

# Ask for version upgrade type
echo -e "${YELLOW}Select version upgrade type:${NC}"
PS3=$'\n'"Choose option [1-4]: "
options=("Major ($(($major + 1)).0.0)" "Minor ($major.$(($minor + 1)).0)" "Patch ($major.$minor.$(($patch + 1)))" "No version change")
version_type=""

select opt in "${options[@]}"
do
    case $opt in
        "Major ($(($major + 1)).0.0)")
            new_version="$(($major + 1)).0.0"
            version_type="major"
            break
            ;;
        "Minor ($major.$(($minor + 1)).0)")
            new_version="$major.$(($minor + 1)).0"
            version_type="minor"
            break
            ;;
        "Patch ($major.$minor.$(($patch + 1)))")
            new_version="$major.$minor.$(($patch + 1))"
            version_type="patch"
            break
            ;;
        "No version change")
            new_version="$current_version"
            version_type="none"
            break
            ;;
        *) 
            echo -e "${RED}Invalid option. Please try again.${NC}"
            ;;
    esac
done

# Generate branch name with updated format
branch_name="release-$version_type-v$new_version"
pr_title="release-$version_type-v$new_version"

# If no version change was selected, adjust the branch name
if [ "$version_type" == "none" ]; then
    branch_name="release-v$new_version"
    pr_title="release-v$new_version"
fi

echo -e "${BLUE}Using branch name: ${GREEN}$branch_name${NC}"

# Sync staging with main locally without pushing to remote
echo -e "${BLUE}Creating temporary local branch 'staging-sync' from origin/staging...${NC}"
git checkout -B staging-sync origin/staging

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to create 'staging-sync' branch${NC}"
    exit 1
fi

echo -e "${BLUE}Merging origin/main into staging-sync...${NC}"
git merge origin/main --no-edit

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Merge conflict while merging main into staging-sync. Resolve manually.${NC}"
    exit 1
fi

# Create the release branch from the merged staging-sync
echo -e "${BLUE}Creating new branch '$branch_name' from merged staging-sync...${NC}"
git checkout -b "$branch_name"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to create new branch from staging-sync${NC}"
    exit 1
fi

# Delete the temporary staging-sync branch
echo -e "${BLUE}Cleaning up temporary branch 'staging-sync'...${NC}"
git branch -D staging-sync

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Warning: Failed to delete 'staging-sync' branch. You may need to remove it manually.${NC}"
else
    echo -e "${GREEN}Temporary branch 'staging-sync' deleted successfully.${NC}"
fi

# Update version in package.json if changed
if [ "$new_version" != "$current_version" ]; then
    echo -e "${BLUE}Updating version from ${RED}$current_version${BLUE} to ${GREEN}$new_version${NC}"
    # Using sed to update version in package.json
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS requires a different sed syntax
        sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json
    else
        # Linux syntax
        sed -i "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json
    fi
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to update version in package.json${NC}"
        exit 1
    fi
    
    # Add updated package.json
    echo -e "${BLUE}Committing version update...${NC}"
    git add package.json
    git commit -m "chore: update version to $new_version" --no-verify
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to commit version update${NC}"
        exit 1
    fi
fi

# Ask if user wants to push the branch
echo -e "${YELLOW}Do you want to push the branch to remote? (y/n)${NC}"
read -r push_choice

if [[ $push_choice =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Pushing branch to remote...${NC}"
    git push -u origin "$branch_name"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to push branch to remote${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Branch pushed successfully!${NC}"
    
    # Ask if user wants to create a PR
    echo -e "${YELLOW}Do you want to create a pull request to main? (y/n)${NC}"
    read -r pr_choice
    
    if [[ $pr_choice =~ ^[Yy]$ ]]; then
        # Ask for pull request body/description in a more user-friendly way
        echo -e "${YELLOW}Enter a description for the pull request (single line or press enter for empty description):${NC}"
        read -r pr_body
        
        pr_url=""
        
        # Check if GitHub CLI is available
        if check_gh_cli; then
            echo -e "${BLUE}Creating pull request...${NC}"
            # Create PR and capture the output which contains the PR URL
            pr_response=$(gh pr create --base main --head "$branch_name" --title "$pr_title" --body "$pr_body")
            
            if [ $? -ne 0 ]; then
                echo -e "${RED}Error: Failed to create pull request${NC}"
                echo -e "${YELLOW}You may need to log in with 'gh auth login' or create the PR manually${NC}"
            else
                # Extract PR URL from response
                pr_url=$(echo "$pr_response" | grep -o 'https://.*')
                echo -e "${GREEN}Pull request created successfully!${NC}"
                echo -e "${BLUE}PR URL: ${GREEN}$pr_url${NC}"
            fi
        else
            # Get remote origin URL
            origin_url=$(git config --get remote.origin.url)
            repo_path=$(echo "$origin_url" | sed -E 's/.*[:/]([^/]+\/[^.]+)(\.git)?$/\1/')
            
            echo -e "${YELLOW}Cannot create PR automatically. Please create it manually:${NC}"
            
            # GitHub URL format
            if [[ $origin_url == *"github.com"* ]]; then
                pr_url="https://github.com/$repo_path/compare/main...$branch_name"
                echo -e "${BLUE}$pr_url${NC}"
            # GitLab URL format
            elif [[ $origin_url == *"gitlab"* ]]; then
                pr_url="https://gitlab.com/$repo_path/-/merge_requests/new?merge_request%5Bsource_branch%5D=$branch_name&merge_request%5Btarget_branch%5D=main"
                echo -e "${BLUE}$pr_url${NC}"
            # Bitbucket URL format
            elif [[ $origin_url == *"bitbucket"* ]]; then
                pr_url="https://bitbucket.org/$repo_path/pull-requests/new?source=$branch_name&dest=main"
                echo -e "${BLUE}$pr_url${NC}"
            # Azure DevOps URL format (simplified)
            elif [[ $origin_url == *"dev.azure.com"* || $origin_url == *"visualstudio.com"* ]]; then
                echo -e "${BLUE}Please create the PR through the Azure DevOps web interface${NC}"
            else
                echo -e "${BLUE}Please create the PR through your git provider's web interface${NC}"
            fi
        fi
    fi
else
    echo -e "${BLUE}Branch not pushed. You can push it later with:${NC}"
    echo -e "${GREEN}git push -u origin $branch_name${NC}"
fi

echo -e "${GREEN}Success! New branch '$branch_name' created from staging.${NC}"
echo -e "${BLUE}Summary:${NC}"
echo -e "  - Branch: ${GREEN}$branch_name${NC}"
echo -e "  - Based on: ${GREEN}staging${NC}"
echo -e "  - Version: ${GREEN}$new_version${NC}"
if [[ $push_choice =~ ^[Yy]$ ]]; then
    echo -e "  - Pushed to remote: ${GREEN}Yes${NC}"
    if [[ $pr_choice =~ ^[Yy]$ ]]; then
        echo -e "  - Pull request created: ${GREEN}Yes${NC}"
        if [ ! -z "$pr_url" ]; then
            echo -e "  - Pull request URL: ${GREEN}$pr_url${NC}"
        fi
        echo -e "  - Pull request title: ${GREEN}$pr_title${NC}"
    fi
else
    echo -e "  - Pushed to remote: ${RED}No${NC}"
fi